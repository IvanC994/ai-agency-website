import { useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useCountUp } from '../hooks/useCountUp';

const StatCard = ({ target, staticValue, suffix, description, isVisible }: { 
  target: number, 
  staticValue?: string, 
  suffix: string, 
  description: string,
  isVisible: boolean 
}) => {
  // Only start count up when visible
  const { count } = useCountUp(isVisible ? target : 0, 1500, suffix);

  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(sectionRef);

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center" ref={sectionRef}>
          
          <div className="max-w-lg">
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
              />
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
};
