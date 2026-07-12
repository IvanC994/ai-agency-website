import { useLanguage } from '../context/LanguageContext';
import { HeroMockup } from './HeroMockup';

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

          {/* Right Column (Animated Mockup) */}
          <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
            {/* Decorative background blur */}
            <div className="absolute -inset-1 bg-gradient-to-tr from-sky-400 to-sky-200 rounded-3xl blur-2xl opacity-20 transform rotate-6"></div>
            <div className="relative">
              <HeroMockup />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};
