import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X } from 'lucide-react';
import { CortexFlowIcon } from './CortexFlowIcon';

export const Navbar = () => {
  const { lang, dict } = useLanguage();
  const [location, setLocation] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLang = (newLang: 'en' | 'sr') => {
    if (newLang === lang) return;
    setLocation(newLang === 'en' ? '/' : '/sr');
  };

  const navLinks = [
    { name: dict.nav.services, href: '#services' },
    { name: dict.nav.industries, href: '#industries' },
    { name: dict.nav.process, href: '#process' },
    { name: dict.nav.faq, href: '#faq' },
    { name: dict.nav.contact, href: '#contact' },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link href={lang === 'en' ? '/' : '/sr'} className="flex items-center gap-3">
            <CortexFlowIcon size={36} />
            <span className="font-bold text-xl text-slate-900 tracking-tight">CortexFlow</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-full">
              <button 
                onClick={() => toggleLang('en')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${lang === 'en' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                EN
              </button>
              <button 
                onClick={() => toggleLang('sr')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${lang === 'sr' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                SR
              </button>
            </div>
            
            <a 
              href="#contact" 
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-full bg-slate-950 text-white hover:bg-slate-800 transition-colors"
            >
              {dict.nav.bookConsultation}
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 absolute top-20 left-0 w-full shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-4">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-md"
              >
                {link.name}
              </a>
            ))}
            
            <div className="pt-4 flex items-center justify-between border-t border-slate-100 px-3">
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-full">
                <button 
                  onClick={() => { toggleLang('en'); setMobileMenuOpen(false); }}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full ${lang === 'en' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => { toggleLang('sr'); setMobileMenuOpen(false); }}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full ${lang === 'sr' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                >
                  SR
                </button>
              </div>
              
              <a 
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-full bg-slate-950 text-white hover:bg-slate-800 transition-colors"
              >
                {dict.nav.bookConsultation}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
