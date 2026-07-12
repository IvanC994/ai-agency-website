import { useLanguage } from '../context/LanguageContext';
import { useScrollReveal, revealStyle } from '../hooks/useScrollReveal';

export const WhyUs = () => {
  const { dict } = useLanguage();
  const { ref, visible } = useScrollReveal();

  return (
    <section
      className="py-24 bg-white"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-3xl p-10 md:p-16 border border-slate-100">
          <div
            className="text-center max-w-2xl mx-auto mb-16"
            style={revealStyle(visible, 0)}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              {dict.whyUs.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {dict.whyUs.cards.map((card, idx) => (
              <div
                key={idx}
                style={revealStyle(visible, 120 + idx * 90)}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-start text-left"
              >
                <h3 className="text-base font-bold text-slate-900 mb-2 leading-tight">
                  {card.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
