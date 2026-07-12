import { useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollReveal, revealStyle } from '../hooks/useScrollReveal';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
  stat?: string;
}

// ─── Card ─────────────────────────────────────────────────────────────────────

const TestimonialCard = ({
  item,
  visible,
  delay,
}: {
  item: TestimonialItem;
  visible: boolean;
  delay: number;
}) => (
  <div
    className="snap-start flex-shrink-0 w-[85vw] sm:w-[55vw] lg:w-[400px] xl:w-[420px]"
    style={revealStyle(visible, delay)}
  >
    <div className="h-full bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-8 flex flex-col">
      {/* Quote icon */}
      <Quote className="w-6 h-6 text-sky-300 mb-5 flex-shrink-0" />

      {/* Quote body */}
      <p className="text-slate-600 leading-relaxed text-sm flex-1 mb-6">
        {item.quote}
      </p>

      {/* Divider */}
      <div className="border-t border-slate-100 mb-5" />

      {/* Footer: avatar + name/role + stat pill */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {/* Initials avatar */}
          <div className="w-10 h-10 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center flex-shrink-0">
            <span className="text-sky-700 text-xs font-bold tracking-wide">
              {item.initials}
            </span>
          </div>
          {/* Name / role */}
          <div className="min-w-0">
            <div className="text-sm font-bold text-slate-900 truncate">
              {item.name}
            </div>
            <div className="text-xs text-slate-500 truncate">
              {item.role} · {item.company}
            </div>
          </div>
        </div>

        {/* Optional result stat pill */}
        {item.stat && (
          <div className="flex-shrink-0 px-2.5 py-1 rounded-full bg-sky-50 border border-sky-100">
            <span className="text-xs font-semibold text-sky-700 whitespace-nowrap">
              {item.stat}
            </span>
          </div>
        )}
      </div>
    </div>
  </div>
);

// ─── Section ──────────────────────────────────────────────────────────────────

export const Testimonials = () => {
  const { dict } = useLanguage();
  const { ref, visible } = useScrollReveal();

  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const items: TestimonialItem[] = dict.testimonials.items;

  // ── Scroll helpers ──────────────────────────────────────────────────────────

  /** Scroll the carousel to card at `idx`, clamped to valid range. */
  const scrollToCard = useCallback(
    (idx: number) => {
      if (!containerRef.current) return;
      const clamped = Math.max(0, Math.min(idx, items.length - 1));
      const container = containerRef.current;
      const firstCard = container.children[0] as HTMLElement | undefined;
      if (!firstCard) return;
      // gap-5 = 20 px; multiply card-width + gap by target index
      const cardWidth = firstCard.offsetWidth;
      const gap = 20;
      container.scrollTo({ left: clamped * (cardWidth + gap), behavior: 'smooth' });
      setActiveIdx(clamped);
    },
    [items.length]
  );

  /** Keep the active dot in sync when the user swipes manually. */
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const firstCard = container.children[0] as HTMLElement | undefined;
    if (!firstCard) return;
    const cardWidth = firstCard.offsetWidth + 20;
    const idx = Math.round(container.scrollLeft / cardWidth);
    setActiveIdx(Math.min(Math.max(idx, 0), items.length - 1));
  }, [items.length]);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <section
      id="testimonials"
      ref={ref as React.RefObject<HTMLElement>}
      className="py-24 bg-slate-50 border-t border-slate-100 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header row: eyebrow + title + prev/next arrows ── */}
        <div
          className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
          style={revealStyle(visible, 0)}
        >
          <div>
            <p className="text-sky-600 text-sm font-bold uppercase tracking-wider mb-3">
              {dict.testimonials.eyebrow}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight max-w-xl">
              {dict.testimonials.heading}
            </h2>
          </div>

          {/* Circular arrow buttons */}
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={() => scrollToCard(activeIdx - 1)}
              aria-label="Previous testimonial"
              className="w-11 h-11 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors duration-150"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollToCard(activeIdx + 1)}
              aria-label="Next testimonial"
              className="w-11 h-11 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors duration-150"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Carousel ── */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          // Hide the scrollbar cross-browser
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
        >
          {items.map((item, i) => (
            <TestimonialCard
              key={i}
              item={item}
              visible={visible}
              delay={80 + i * 60}
            />
          ))}
          {/* Trailing spacer so the last card isn't flush against the edge */}
          <div className="flex-shrink-0 w-4 sm:w-6 lg:w-8" aria-hidden="true" />
        </div>

        {/* ── Dot indicators — visible on mobile only ── */}
        <div className="flex justify-center gap-2 mt-6 sm:hidden">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToCard(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`rounded-full transition-all duration-200 ${
                i === activeIdx
                  ? 'w-5 h-2 bg-slate-800'
                  : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
