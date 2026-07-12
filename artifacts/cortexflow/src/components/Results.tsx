import { useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useCountUp } from '../hooks/useCountUp';
import { useScrollReveal, revealStyle } from '../hooks/useScrollReveal';

const StatCard = ({ target, staticValue, suffix, description, isVisible, revealVisible, revealDelay }: {
  target: number,
  staticValue?: string,
  suffix: string,
  description: string,
  isVisible: boolean,
  revealVisible: boolean,
  revealDelay: number,
}) => {
  const { count } = useCountUp(isVisible ? target : 0, 1500, suffix);

  return (
    <div
      style={revealStyle(revealVisible, revealDelay)}
      className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center"
    >
      <div className="text-5xl font-extrabold text-slate-900 mb-3 tracking-tight">
        {staticValue ? staticValue : `${count}${suffix}`}
      </div>
      <p className="text-slate-600 font-medium">
        {description}
      </p>
    </div>
  );
};

export const Results = () => {
  const { dict } = useLanguage();

  // Count-up trigger — on the inner grid
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(sectionRef);

  // Scroll-reveal trigger — on the outer section
  const { ref: revealRef, visible: revealVisible } = useScrollReveal();

  return (
    <section
      className="py-24 bg-slate-50 border-t border-slate-100"
      ref={revealRef as React.RefObject<HTMLElement>}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center" ref={sectionRef}>

          <div
            className="max-w-lg"
            style={revealStyle(revealVisible, 0)}
          >
            <div className="text-sky-600 text-sm font-bold uppercase tracking-wider mb-4">
              {dict.results.eyebrow}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
              {dict.results.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {dict.results.cards.map((card, idx) => (
              <StatCard
                key={idx}
                target={card.value}
                staticValue={card.staticValue}
                suffix={card.suffix}
                description={card.description}
                isVisible={isVisible}
                revealVisible={revealVisible}
                revealDelay={120 + idx * 90}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
