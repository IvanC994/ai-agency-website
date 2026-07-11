import { useLanguage } from '../context/LanguageContext';
import { Link } from 'wouter';

export const Footer = () => {
  const { lang, dict } = useLanguage();

  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          <div className="lg:col-span-2">
            <Link href={lang === 'en' ? '/' : '/sr'} className="flex items-center gap-3 mb-6 inline-flex">
              <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg leading-none">CF</span>
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">CortexFlow</span>
            </Link>
            <p className="text-slate-600 max-w-sm">
              {dict.footer.tagline}
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-4">{dict.footer.links.services.title}</h4>
            <ul className="space-y-3">
              {dict.footer.links.services.items.map((item, idx) => (
                <li key={idx}>
                  <a href="#services" className="text-slate-600 hover:text-slate-900 text-sm">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-4">{dict.footer.links.industries.title}</h4>
            <ul className="space-y-3">
              {dict.footer.links.industries.items.map((item, idx) => (
                <li key={idx}>
                  <a href="#industries" className="text-slate-600 hover:text-slate-900 text-sm">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-4">{dict.footer.links.company.title}</h4>
            <ul className="space-y-3">
              {dict.footer.links.company.items.map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="text-slate-600 hover:text-slate-900 text-sm">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          
        </div>
        
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            {dict.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};
