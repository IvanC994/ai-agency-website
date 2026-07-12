import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Plus } from 'lucide-react';
import { useScrollReveal, revealStyle } from '../hooks/useScrollReveal';

export const Industries = () => {
  const { dict } = useLanguage();
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const { ref, visible } = useScrollReveal();

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section
      id="industries"
      className="py-24 bg-slate-50 scroll-mt-20"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-12 text-center"
          style={revealStyle(visible, 0)}
        >
          {dict.industries.title}
        </h2>

        <div className="space-y-4">
          {dict.industries.items.map((item, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div
                key={idx}
                style={revealStyle(visible, 120 + idx * 90)}
                className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-sky-200 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="text-lg font-bold text-slate-900">{item.name}</span>
                  </div>
                  <div className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-45 text-slate-600' : ''}`}>
                    <Plus size={24} />
                  </div>
                </button>

                <div
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0 pb-0'}`}
                >
                  <p className="text-slate-600 leading-relaxed pl-12 border-l-2 border-slate-100">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
