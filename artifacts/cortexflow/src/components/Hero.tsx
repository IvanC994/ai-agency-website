import { useLanguage } from '../context/LanguageContext';
import { CheckCircle2 } from 'lucide-react';

export const Hero = () => {
  const { dict } = useLanguage();

  return (
    <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          
          {/* Left Column */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-sky-600 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
              {dict.hero.eyebrow}
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
              {dict.hero.headline}
            </h1>
            
            <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-lg">
              {dict.hero.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a 
                href="#contact"
                className="inline-flex justify-center items-center px-6 py-3.5 rounded-full bg-slate-950 text-white font-semibold hover:bg-slate-800 transition-colors"
              >
                {dict.hero.ctaPrimary}
              </a>
              <a 
                href="#services"
                className="inline-flex justify-center items-center px-6 py-3.5 rounded-full bg-white text-slate-900 font-semibold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
              >
                {dict.hero.ctaSecondary}
              </a>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {dict.hero.tags.map(tag => (
                <span key={tag} className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column (Mockup) */}
          <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
            {/* Decorative background blur */}
            <div className="absolute -inset-1 bg-gradient-to-tr from-sky-400 to-sky-200 rounded-3xl blur-2xl opacity-20 transform rotate-6"></div>
            
            <div className="relative rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl shadow-sky-900/10 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  <span className="text-sm font-medium text-slate-200">{dict.hero.mockupTitle}</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                </div>
              </div>
              
              {/* Chat Interface */}
              <div className="p-6 space-y-6 bg-slate-950">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex-shrink-0 flex items-center justify-center text-xs font-medium text-slate-400">
                    U
                  </div>
                  <div className="bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-200 shadow-sm leading-relaxed max-w-[85%]">
                    {dict.hero.mockupUser}
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-sky-500 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-sky-500/20">
                    CF
                  </div>
                  <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-200 shadow-sm leading-relaxed max-w-[85%]">
                    {dict.hero.mockupAi}
                  </div>
                </div>
              </div>
              
              {/* Status Row */}
              <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap gap-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-900/50">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-400">{dict.hero.mockupStatus1}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-900/50">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-400">{dict.hero.mockupStatus2}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-900/50">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-400">{dict.hero.mockupStatus3}</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};
