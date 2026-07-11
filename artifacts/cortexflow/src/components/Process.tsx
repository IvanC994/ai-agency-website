import { useLanguage } from '../context/LanguageContext';

export const Process = () => {
  const { dict } = useLanguage();

  return (
    <section id="process" className="py-24 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            {dict.process.title}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector line for desktop */}
          <div className="hidden lg:block absolute top-6 left-12 right-12 h-px bg-slate-200 z-0"></div>
          
          {dict.process.cards.map((card, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="w-12 h-12 rounded-full bg-slate-950 text-white flex items-center justify-center font-bold text-lg mb-6 border-4 border-white shadow-sm shrink-0">
                {card.step}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {card.name}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
