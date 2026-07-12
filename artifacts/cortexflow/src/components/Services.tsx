import { useLanguage } from '../context/LanguageContext';
import { PhoneCall, MessageSquare, Zap, Cpu, CheckCircle2 } from 'lucide-react';
import { useScrollReveal, revealStyle } from '../hooks/useScrollReveal';

const icons = {
  phone: PhoneCall,
  chat: MessageSquare,
  workflow: Zap,
  custom: Cpu,
};

export const Services = () => {
  const { dict } = useLanguage();
  const { ref, visible } = useScrollReveal();

  return (
    <section
      id="services"
      className="py-24 bg-white scroll-mt-20"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="mb-16"
          style={revealStyle(visible, 0)}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            {dict.services.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {dict.services.cards.map((card, idx) => {
            const IconComponent = icons[card.id as keyof typeof icons];

            return (
              <div
                key={card.id}
                style={revealStyle(visible, 120 + idx * 90)}
                className="group relative bg-white border border-slate-200 rounded-3xl p-8 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />

                <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mb-6 text-sky-600 border border-sky-100">
                  <IconComponent size={24} strokeWidth={2} />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {card.title}
                </h3>

                <p className="text-slate-600 mb-8 leading-relaxed">
                  {card.description}
                </p>

                <ul className="space-y-3">
                  {card.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
