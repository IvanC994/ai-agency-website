import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// ─── Reduced-motion helper ────────────────────────────────────────────────────

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── Typing indicator ─────────────────────────────────────────────────────────

/**
 * Three bouncing dots with staggered delays — the classic "typing…" indicator.
 * Each dot uses Tailwind's `animate-bounce` (infinite by default).
 */
const TypingDots = () => (
  <div className="flex gap-1.5 items-center" aria-label="typing">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
        style={{ animationDelay: `${i * 180}ms`, animationDuration: '900ms' }}
      />
    ))}
  </div>
);

// ─── Status badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ label, lit }: { label: string; lit: boolean }) => (
  <div
    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all duration-300 ${
      lit
        ? 'bg-emerald-950/40 border-emerald-900/50'
        : 'bg-slate-800/60 border-slate-700/50'
    }`}
  >
    <CheckCircle2
      className={`w-3.5 h-3.5 transition-all duration-300 ${
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

/**
 * Animated "Live workflow" demo card.
 *
 * Loop sequence (total ~5.3 s per cycle):
 *   0 ms    — typing dots visible, AI text hidden, all status badges dim
 *   1400 ms — typing dots fade out, AI response text fades in
 *   1900 ms — CRM badge lights up
 *   2350 ms — Calendar badge lights up
 *   2800 ms — Email badge lights up
 *   5300 ms — hold ends; reset and repeat
 *
 * `prefers-reduced-motion`: renders the final completed state statically.
 */
export const HeroMockup = () => {
  const { dict } = useLanguage();
  const reduced = prefersReducedMotion();

  // Initialise to the completed state when reduced-motion is preferred.
  const [showResponse, setShowResponse] = useState<boolean>(reduced);
  const [statusCount, setStatusCount] = useState<number>(reduced ? 3 : 0);

  useEffect(() => {
    if (reduced) return;

    // Each call to startLoop clears the previous batch of timeouts, then
    // schedules the next batch. The returned cleanup cancels the current batch.
    let ids: ReturnType<typeof setTimeout>[] = [];

    const startLoop = () => {
      ids.forEach(clearTimeout);
      ids = [];

      const add = (fn: () => void, delay: number) => {
        ids.push(setTimeout(fn, delay));
      };

      // Reset to initial state
      setShowResponse(false);
      setStatusCount(0);

      // Phase 1 — typing indicator → AI response
      add(() => setShowResponse(true), 1400);

      // Phase 2 — status badges light up one by one
      add(() => setStatusCount(1), 1900);
      add(() => setStatusCount(2), 2350);
      add(() => setStatusCount(3), 2800);

      // Hold the completed state for 2 500 ms, then loop
      add(startLoop, 5300);
    };

    startLoop();
    return () => ids.forEach(clearTimeout);
  }, []); // intentionally empty — runs once on mount

  const statuses = [
    dict.hero.mockupStatus1,
    dict.hero.mockupStatus2,
    dict.hero.mockupStatus3,
  ];

  return (
    <div className="relative rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl shadow-sky-900/10 overflow-hidden">

      {/* ── Card header ── */}
      <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-sm font-medium text-slate-200">
            {dict.hero.mockupTitle}
          </span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
        </div>
      </div>

      {/* ── Chat area ── */}
      <div className="p-6 space-y-6 bg-slate-950">

        {/* Row 1 — Lead arrives (always visible) */}
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex-shrink-0 flex items-center justify-center text-xs font-medium text-slate-400">
            U
          </div>
          <div className="bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-200 shadow-sm leading-relaxed max-w-[85%]">
            {dict.hero.mockupUser}
          </div>
        </div>

        {/* Row 2 — AI response (typing dots → response text) */}
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-sky-500 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-sky-500/20">
            CF
          </div>

          {/*
           * The bubble's height is set by the response text (always in the
           * layout flow). The typing dots are positioned absolutely over the
           * bubble so the card never jumps in height.
           */}
          <div className="relative bg-slate-800/60 border border-slate-700/50 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-200 shadow-sm leading-relaxed max-w-[85%]">

            {/* Response text — transparent during typing phase */}
            <span
              style={{
                opacity: showResponse ? 1 : 0,
                transition: 'opacity 400ms ease-in-out',
                display: 'block',
              }}
            >
              {dict.hero.mockupAi}
            </span>

            {/* Typing dots — overlaid absolutely, hidden once response shows */}
            {!reduced && (
              <div
                className="absolute inset-0 flex items-center px-4"
                style={{
                  opacity: showResponse ? 0 : 1,
                  transition: 'opacity 300ms ease-in-out',
                  pointerEvents: 'none',
                }}
                aria-hidden="true"
              >
                <TypingDots />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Row 3 — System update badges ── */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap gap-3">
        {statuses.map((label, idx) => (
          <StatusBadge key={idx} label={label} lit={statusCount > idx} />
        ))}
      </div>

    </div>
  );
};
