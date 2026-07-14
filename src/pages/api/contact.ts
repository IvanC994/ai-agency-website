import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

const json = (body: Record<string, unknown>, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store'
  }
});

const getText = (value: unknown, maximumLength: number) =>
  typeof value === 'string' ? value.trim().slice(0, maximumLength) : '';

export const POST: APIRoute = async ({ request }) => {
  const origin = request.headers.get('Origin');
  if (origin !== 'https://routineforge.tech') {
    return json({ message: 'Invalid request origin.' }, 403);
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return json({ message: 'Invalid request payload.' }, 400);
  }

  const industry = getText(payload.industry, 120);
  const service = getText(payload.service, 120);
  const name = getText(payload.name, 120);
  const email = getText(payload.email, 254);
  const phone = getText(payload.phone, 60);
  const message = getText(payload.message, 2_000);
  const locale = payload.locale === 'sr' ? 'sr' : 'en';
  const turnstileToken = getText(payload.turnstileToken, 2_048);

  if (!industry || !service || !name || !email || !turnstileToken) {
    return json({ message: 'Please complete all required fields.' }, 400);
  }

  const runtimeEnv = env as unknown as Record<string, string | undefined>;
  const turnstileSecret = runtimeEnv.TURNSTILE_SECRET_KEY;
  const webhookUrl = runtimeEnv.N8N_CONTACT_WEBHOOK_URL;

  if (!turnstileSecret || !webhookUrl) {
    console.error('Contact form secrets are not configured.');
    return json({ message: 'The contact form is temporarily unavailable.' }, 503);
  }

  const verificationBody = new FormData();
  verificationBody.append('secret', turnstileSecret);
  verificationBody.append('response', turnstileToken);
  const remoteIp = request.headers.get('CF-Connecting-IP');
  if (remoteIp) verificationBody.append('remoteip', remoteIp);

  let verification: { success?: boolean; hostname?: string };
  try {
    const verificationResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: verificationBody
    });
    verification = await verificationResponse.json();
  } catch (error) {
    console.error('Turnstile verification request failed', error);
    return json({ message: 'Security verification is temporarily unavailable.' }, 503);
  }

  if (!verification.success || verification.hostname !== 'routineforge.tech') {
    return json({ message: 'Security verification failed. Please try again.' }, 400);
  }

  try {
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        industry,
        service,
        name,
        email,
        phone,
        message,
        locale,
        submittedAt: new Date().toISOString(),
        sourceUrl: 'https://routineforge.tech'
      })
    });

    if (!webhookResponse.ok) {
      console.error('n8n webhook responded with', webhookResponse.status);
      return json({ message: 'We could not send your request. Please try again.' }, 502);
    }
  } catch (error) {
    console.error('n8n webhook request failed', error);
    return json({ message: 'We could not send your request. Please try again.' }, 502);
  }

  return json({ ok: true });
};
