import { useEffect, useState } from 'react';
import { User, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { CortexFlowIcon } from './CortexFlowIcon';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── Phase encoding ───────────────────────────────────────────────────────────
//
//  0  reset  — only msg1 visible, rows 2-4 invisible, all status dim
//  1  AI row 2 fades in with typing dots
//  2  AI msg2 text fades in, dots fade out
//  3  customer msg3 row fades in
//  4  AI row 4 fades in with typing dots
//  5  AI msg4 text fades in, dots fade out
//  6  status 1 lights up (CRM)
//  7  status 2 lights up (Calendar)
//  8  status 3 lights up (Email)  ← complete state; hold 2.5 s then loop
//
// statusCount = clamp(phase - 5, 0, 3)
// Total cycle: ~8.3 s

// ─── Sub-components ───────────────────────────────────────────────────────────

const TypingDots = () => (
  <div className="flex gap-1.5 items-center" aria-label="typing">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
        style={{ animationDelay: `${i * 180}ms`, animationDuration: '900ms' }}
      />
    ))}
  </div>
);

/** Round avatar for customer messages. */
const CustomerAvatar = () => (
  <div className="w-7 h-7 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center">
    <User className="w-3.5 h-3.5 text-slate-400" />
  </div>
);

/** CortexFlow brand icon avatar for AI messages. */
const AiAvatar = () => (
  <div className="flex-shrink-0">
    <CortexFlowIcon size={28} />
  </div>
);

/** Status badge in the system-update row. */
const StatusBadge = ({ label, lit }: { label: string; lit: boolean }) => (
  <div
    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all duration-300 ${
      lit
        ? 'bg-emerald-950/40 border-emerald-900/50'
        : 'bg-slate-800/60 border-slate-700/50'
    }`}
  >
    <CheckCircle2
      className={`w-3 h-3 transition-all duration-300 ${
        lit
          ? 'text-emerald-400 opacity-100 scale-100'
          : 'text-slate-600 opacity-40 scale-75'
      }`}
    />
    <span
      className={`text-xs font-medium transition-colors duration-300 ${
        lit ? 'text-emerald-400' : 'text-slate-500'
      }`}
    >
      {label}
    </span>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

export const HeroMockup = () => {
  const { dict } = useLanguage();
  const reduced = prefersReducedMotion();

  // `animate` controls whether CSS transitions are enabled.
  // It is briefly false on each reset so all rows snap back instantly
  // without visible fade-outs, then re-enabled before the sequence begins.
  const [phase, setPhase] = useState<number>(reduced ? 8 : 0);
  const [animate, setAnimate] = useState<boolean>(false);

  useEffect(() => {
    if (reduced) return;

    let timeoutIds: ReturnType<typeof setTimeout>[] = [];
    let rafIds: number[] = [];

    const startLoop = () => {
      // Cancel the current batch
      timeoutIds.forEach(clearTimeout);
      rafIds.forEach(cancelAnimationFrame);
      timeoutIds = [];
      rafIds = [];

      // 1. Snap reset — no transitions, everything hidden
      setAnimate(false);
      setPhase(0);

      // 2. After two animation frames the hidden state is committed to the
      //    display. Re-enable transitions and schedule the phase sequence.
      rafIds.push(
        requestAnimationFrame(() => {
          rafIds.push(
            requestAnimationFrame(() => {
              setAnimate(true);

              const add = (fn: () => void, delay: number) => {
                timeoutIds.push(setTimeout(fn, delay));
              };

              add(() => setPhase(1), 500);   // AI1 typing starts
              add(() => setPhase(2), 1900);  // AI1 responds
              add(() => setPhase(3), 2500);  // Customer replies
              add(() => setPhase(4), 3100);  // AI2 typing starts
              add(() => setPhase(5), 4400);  // AI2 responds
              add(() => setPhase(6), 4900);  // CRM lights up
              add(() => setPhase(7), 5350);  // Calendar lights up
              add(() => setPhase(8), 5800);  // Email lights up
              add(startLoop, 8300);          // hold 2.5 s then loop
            })
          );
        })
      );
    };

    startLoop();

    return () => {
      timeoutIds.forEach(clearTimeout);
      rafIds.forEach(cancelAnimationFrame);
    };
  }, []); // intentionally empty — runs once on mount

  // ── Derived visibility flags ──────────────────────────────────────────────
  const tr = (dur = '400ms') =>
    animate ? `opacity ${dur} ease-in-out` : 'none';

  // Row visibility (entire row: avatar + bubble)
  const row2Opacity  = phase >= 1 ? 1 : 0;
  const row3Opacity  = phase >= 3 ? 1 : 0;
  const row4Opacity  = phase >= 4 ? 1 : 0;

  // AI bubble content
  const ai1Typing    = phase === 1;   // show dots for msg2
  const ai1Text      = phase >= 2;    // show text for msg2
  const ai2Typing    = phase === 4;   // show dots for msg4
  const ai2Text      = phase >= 5;    // show text for msg4

  const statusCount  = Math.max(0, Math.min(3, phase - 5));

  const statuses = [
    dict.hero.mockupStatus1,
    dict.hero.mockupStatus2,
    dict.hero.mockupStatus3,
  ];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="relative rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl shadow-sky-900/10 overflow-hidden">

      {/* Card header */}
      <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
          <span className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
            {dict.hero.mockupTitle}
          </span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-slate-700" />
          <div className="w-2 h-2 rounded-full bg-slate-700" />
          <div className="w-2 h-2 rounded-full bg-slate-700" />
        </div>
      </div>

      {/* Chat thread */}
      <div className="px-5 py-4 space-y-4 bg-slate-950">

        {/* ── Message 1: customer (always visible) ── */}
        <div className="flex items-start gap-2.5">
          <CustomerAvatar />
          <div className="bg-slate-800 rounded-xl rounded-tl-sm px-3.5 py-2.5 text-xs text-slate-200 leading-relaxed max-w-[85%]">
            {dict.hero.mockupUser}
          </div>
        </div>

        {/* ── Message 2: AI (typing → response) ── */}
        <div
          className="flex items-start gap-2.5"
          style={{ opacity: row2Opacity, transition: tr('350ms') }}
        >
          <AiAvatar />
          {/*
           * The response text is always in the layout flow so the bubble
           * never changes height. The typing dots overlay it absolutely.
           */}
          <div className="relative bg-slate-800/60 border border-slate-700/40 rounded-xl rounded-tl-sm px-3.5 py-2.5 text-xs text-slate-200 leading-relaxed max-w-[85%]">
            {/* Text (sets height) */}
            <span style={{ opacity: ai1Text ? 1 : 0, transition: tr(), display: 'block' }}>
              {dict.hero.mockupAi}
            </span>
            {/* Dots overlay */}
            <div
              className="absolute inset-0 flex items-center px-3.5"
              style={{
                opacity: ai1Typing ? 1 : 0,
                transition: animate ? 'opacity 250ms ease-in-out' : 'none',
                pointerEvents: 'none',
              }}
              aria-hidden="true"
            >
              <TypingDots />
            </div>
          </div>
        </div>

        {/* ── Message 3: customer ── */}
        <div
          className="flex items-start gap-2.5"
          style={{ opacity: row3Opacity, transition: tr('350ms') }}
        >
          <CustomerAvatar />
          <div className="bg-slate-800 rounded-xl rounded-tl-sm px-3.5 py-2.5 text-xs text-slate-200 leading-relaxed max-w-[85%]">
            {dict.hero.mockupUser2}
          </div>
        </div>

        {/* ── Message 4: AI (typing → response) ── */}
        <div
          className="flex items-start gap-2.5"
          style={{ opacity: row4Opacity, transition: tr('350ms') }}
        >
          <AiAvatar />
          <div className="relative bg-slate-800/60 border border-slate-700/40 rounded-xl rounded-tl-sm px-3.5 py-2.5 text-xs text-slate-200 leading-relaxed max-w-[85%]">
            <span style={{ opacity: ai2Text ? 1 : 0, transition: tr(), display: 'block' }}>
              {dict.hero.mockupAi2}
            </span>
            <div
              className="absolute inset-0 flex items-center px-3.5"
              style={{
                opacity: ai2Typing ? 1 : 0,
                transition: animate ? 'opacity 250ms ease-in-out' : 'none',
                pointerEvents: 'none',
              }}
              aria-hidden="true"
            >
              <TypingDots />
            </div>
          </div>
        </div>

      </div>

      {/* System-update status row */}
      <div className="px-5 py-3 bg-slate-900 border-t border-slate-800 flex flex-wrap gap-2">
        {statuses.map((label, idx) => (
          <StatusBadge key={idx} label={label} lit={statusCount > idx} />
        ))}
      </div>

    </div>
  );
};
