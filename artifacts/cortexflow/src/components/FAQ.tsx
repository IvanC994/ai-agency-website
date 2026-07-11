import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Plus } from 'lucide-react';

export const FAQ = () => {
  const { dict } = useLanguage();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-white scroll-mt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-12 text-center">
          {dict.faq.title}
        </h2>
        
        <div className="space-y-4">
          {dict.faq.items.map((item, idx) => {
            const isOpen = openIdx === idx;
            
            return (
              <div 
                key={idx}
                className="bg-white border-b border-slate-200 last:border-0"
              >
                <button 
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between py-6 text-left focus:outline-none"
                >
                  <span className="text-lg font-semibold text-slate-900 pr-8">{item.q}</span>
                  <div className={`text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45 text-slate-900' : ''}`}>
                    <Plus size={24} />
                  </div>
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0 pb-0'}`}
                >
                  <p className="text-slate-600 leading-relaxed pr-12">
                    {item.a}
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
