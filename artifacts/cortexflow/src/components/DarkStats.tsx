import { useLanguage } from '../context/LanguageContext';
import { useScrollReveal, revealStyle } from '../hooks/useScrollReveal';

export const DarkStats = () => {
  const { dict } = useLanguage();
  const { ref, visible } = useScrollReveal();

  return (
    <section
      className="bg-slate-950 py-24 border-y border-slate-900"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="mb-16 text-center md:text-left"
          style={revealStyle(visible, 0)}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            {dict.darkStats.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {dict.darkStats.cards.map((card, idx) => (
            <div
              key={idx}
              style={revealStyle(visible, 120 + idx * 90)}
              className="flex flex-col border-l border-slate-800 pl-6"
            >
              <span className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                {card.stat}
              </span>
              <p className="text-slate-400 font-medium leading-relaxed">
                {card.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
