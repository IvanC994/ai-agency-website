import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

const MAX_QUESTION_LENGTH = 800;
const MAX_RESPONSE_LENGTH = 4_000;
const MAX_REQUEST_BYTES = 16_384;
const CHAT_ACTION = 'chat_message';

type RateLimitBinding = {
  limit: (options: { key: string }) => Promise<{ success: boolean }>;
};

type ChatRuntimeEnv = {
  TURNSTILE_SECRET_KEY?: string;
  N8N_CHAT_WEBHOOK_URL?: string;
  N8N_CHAT_WEBHOOK_SECRET?: string;
  CHAT_SESSION_RATE_LIMITER?: RateLimitBinding;
  CHAT_DUPLICATE_RATE_LIMITER?: RateLimitBinding;
  CHAT_IP_RATE_LIMITER?: RateLimitBinding;
  [key: string]: unknown;
};

const json = (body: Record<string, unknown>, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  }
});

const getText = (value: unknown, maximumLength: number) =>
  typeof value === 'string' ? value.trim().slice(0, maximumLength) : '';

const normalizeMessage = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('en')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const SIMPLE_INTENTS = {
  greeting: new Set([
    'hello',
    'hello there',
    'hi',
    'hi there',
    'hey',
    'good morning',
    'good afternoon',
    'good evening',
    'zdravo',
    'cao',
    'hej',
    'pozdrav',
    'dobar dan',
    'dobro jutro',
    'dobro vece'
  ]),
  thanks: new Set([
    'thanks',
    'thanks a lot',
    'thank you',
    'thank you very much',
    'great thanks',
    'hvala',
    'hvala puno',
    'mnogo hvala',
    'zahvaljujem'
  ]),
  goodbye: new Set([
    'bye',
    'goodbye',
    'see you',
    'see you later',
    'talk to you later',
    'dovidenja',
    'vidimo se',
    'sve najbolje'
  ])
} as const;

type SimpleIntent = keyof typeof SIMPLE_INTENTS;

const SIMPLE_RESPONSES: Record<'en' | 'sr', Record<SimpleIntent, string>> = {
  en: {
    greeting: 'Hi! How can I help you with RoutineForge services, industry solutions, or automation?',
    thanks: 'You’re welcome! If you need anything else, feel free to ask.',
    goodbye: 'Goodbye! If you would like to discuss your workflow with our team, you can use the contact form.'
  },
  sr: {
    greeting: 'Zdravo! Kako mogu da Vam pomognem u vezi sa RoutineForge uslugama, industrijskim rešenjima ili automatizacijom?',
    thanks: 'Nema na čemu! Slobodno pitajte ako Vam je potrebno još nešto.',
    goodbye: 'Doviđenja! Ako želite da razgovarate sa našim timom o svom procesu, možete koristiti kontakt formu.'
  }
};

const detectSimpleIntent = (question: string): SimpleIntent | null => {
  const normalized = normalizeMessage(question);

  for (const [intent, phrases] of Object.entries(SIMPLE_INTENTS) as [SimpleIntent, Set<string>][]) {
    if (phrases.has(normalized)) return intent;
  }

  return null;
};

const hashMessage = async (value: string) => {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(normalizeMessage(value))
  );

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

const passesRateLimit = async (
  limiter: RateLimitBinding | undefined,
  key: string,
  label: string
) => {
  if (!limiter) {
    console.error(`${label} binding is not configured.`);
    return true;
  }

  try {
    return (await limiter.limit({ key })).success;
  } catch (error) {
    console.error(`${label} check failed`, error);
    return true;
  }
};

const legalQuestionPattern =
  /\b(privacy|personal data|data protection|gdpr|cookies?|terms(?:\s+of\s+use)?|legal|privatnost|ličn(?:i|ih|e)\s+podaci|podacima\s+o\s+ličnosti|zaštit(?:a|i)\s+podataka|zzpl|kolačić(?:i|ima|e)?|uslovi\s+korišćenja|pravn(?:o|i|a))\b/iu;

const sanitizePageUrl = (value: unknown, requestOrigin: string) => {
  const rawValue = getText(value, 1_024);
  if (!rawValue) return `${requestOrigin}/`;

  try {
    const pageUrl = new URL(rawValue);
    if (pageUrl.origin !== requestOrigin) return `${requestOrigin}/`;
    return `${pageUrl.origin}${pageUrl.pathname}`;
  } catch {
    return `${requestOrigin}/`;
  }
};

const sanitizeSources = (value: unknown) => {
  if (!Array.isArray(value)) return [];

  return value
    .slice(0, 3)
    .map((source) => {
      if (!source || typeof source !== 'object') return null;
      const item = source as Record<string, unknown>;
      const title = getText(item.title, 160);
      const rawUrl = getText(item.url, 1_024);

      try {
        const url = new URL(rawUrl);
        if (url.protocol !== 'https:' || url.hostname !== 'routineforge.tech') return null;
        return { title: title || 'RoutineForge', url: url.href };
      } catch {
        return null;
      }
    })
    .filter((source): source is { title: string; url: string } => Boolean(source));
};

export const POST: APIRoute = async ({ request }) => {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get('Origin');

  if (!origin || origin !== requestUrl.origin) {
    return json({ message: 'Invalid request origin.' }, 403);
  }

  const contentLength = Number(request.headers.get('Content-Length') || '0');
  if (contentLength > MAX_REQUEST_BYTES) {
    return json({ message: 'Request payload is too large.' }, 413);
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return json({ message: 'Invalid request payload.' }, 400);
  }

  const question = getText(payload.question, MAX_QUESTION_LENGTH);
  const locale = payload.locale === 'sr' ? 'sr' : 'en';
  const sessionId = getText(payload.sessionId, 100);
  const turnstileToken = getText(payload.turnstileToken, 2_048);
  const pageUrl = sanitizePageUrl(payload.pageUrl, requestUrl.origin);

  if (question.length < 2 || !turnstileToken) {
    return json({ message: 'A question and security token are required.' }, 400);
  }

  if (sessionId && !/^[a-zA-Z0-9_-]{8,100}$/.test(sessionId)) {
    return json({ message: 'Invalid chat session.' }, 400);
  }

  const runtimeEnv = env as unknown as ChatRuntimeEnv;
  const turnstileSecret = runtimeEnv.TURNSTILE_SECRET_KEY;
  const webhookUrl = runtimeEnv.N8N_CHAT_WEBHOOK_URL;
  const webhookSecret = runtimeEnv.N8N_CHAT_WEBHOOK_SECRET;

  if (!turnstileSecret || !webhookUrl || !webhookSecret) {
    console.error('Chat endpoint secrets are not configured.');
    return json({ message: 'The assistant is temporarily unavailable.' }, 503);
  }

  const remoteIp = request.headers.get('CF-Connecting-IP');
  if (
    remoteIp &&
    !(await passesRateLimit(runtimeEnv.CHAT_IP_RATE_LIMITER, `chat-ip:${remoteIp}`, 'Chat IP rate limiter'))
  ) {
    return json({ message: 'Too many messages. Please wait before trying again.', code: 'rate_limited' }, 429);
  }

  const verificationBody = new FormData();
  verificationBody.append('secret', turnstileSecret);
  verificationBody.append('response', turnstileToken);

  if (remoteIp) verificationBody.append('remoteip', remoteIp);

  let verification: {
    success?: boolean;
    hostname?: string;
    action?: string;
  };

  try {
    const verificationResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        body: verificationBody,
        signal: AbortSignal.timeout(10_000)
      }
    );

    if (!verificationResponse.ok) {
      throw new Error(`Siteverify responded with ${verificationResponse.status}`);
    }

    verification = await verificationResponse.json();
  } catch (error) {
    console.error('Chat Turnstile verification failed', error);
    return json({ message: 'Security verification is temporarily unavailable.' }, 503);
  }

  if (
    !verification.success ||
    verification.hostname !== requestUrl.hostname ||
    verification.action !== CHAT_ACTION
  ) {
    return json({ message: 'Security verification failed. Please try again.' }, 400);
  }

  const requestId = crypto.randomUUID();
  const actorKey = sessionId
    ? `session:${sessionId}`
    : remoteIp
      ? `ip:${remoteIp}`
      : `request:${requestId}`;

  if (
    !(await passesRateLimit(
      runtimeEnv.CHAT_SESSION_RATE_LIMITER,
      `chat-session:${actorKey}`,
      'Chat session rate limiter'
    ))
  ) {
    return json({ message: 'Too many messages. Please wait before trying again.', code: 'rate_limited' }, 429);
  }

  const questionHash = await hashMessage(question);
  if (
    !(await passesRateLimit(
      runtimeEnv.CHAT_DUPLICATE_RATE_LIMITER,
      `chat-duplicate:${actorKey}:${questionHash}`,
      'Chat duplicate rate limiter'
    ))
  ) {
    return json({
      message: 'This question was just submitted. Please wait before sending it again.',
      code: 'duplicate_question'
    }, 409);
  }

  const simpleIntent = detectSimpleIntent(question);
  if (simpleIntent) {
    return json({
      answer: SIMPLE_RESPONSES[locale][simpleIntent],
      can_answer: true,
      language: locale,
      confidence: 1,
      sources: [],
      intent: simpleIntent
    });
  }

  const scope = legalQuestionPattern.test(question) ? 'legal' : 'general';

  let webhookResponse: Response;
  try {
    webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RoutineForge-Chat-Secret': webhookSecret
      },
      body: JSON.stringify({
        question,
        locale,
        expected_language: locale,
        scope,
        sessionId: sessionId || requestId,
        pageUrl,
        requestId,
        submittedAt: new Date().toISOString()
      }),
      signal: AbortSignal.timeout(30_000)
    });
  } catch (error) {
    console.error('n8n chat request failed', error);
    return json({ message: 'The assistant could not respond. Please try again.' }, 502);
  }

  if (!webhookResponse.ok) {
    console.error('n8n chat webhook responded with', webhookResponse.status);
    return json({ message: 'The assistant could not respond. Please try again.' }, 502);
  }

  let responsePayload: Record<string, unknown>;
  try {
    responsePayload = await webhookResponse.json();
  } catch {
    console.error('n8n chat webhook returned invalid JSON.');
    return json({ message: 'The assistant returned an invalid response.' }, 502);
  }

  const answer = getText(responsePayload.answer, MAX_RESPONSE_LENGTH);
  if (!answer) {
    console.error('n8n chat webhook returned an empty answer.');
    return json({ message: 'The assistant returned an empty response.' }, 502);
  }

  const confidence = Number(responsePayload.confidence);

  return json({
    answer,
    can_answer: responsePayload.can_answer === true,
    language: responsePayload.language === 'sr' ? 'sr' : locale,
    confidence: Number.isFinite(confidence) ? confidence : null,
    sources: sanitizeSources(responsePayload.sources)
  });
};
