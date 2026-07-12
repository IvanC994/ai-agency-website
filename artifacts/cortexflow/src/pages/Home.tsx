import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Marquee } from '../components/Marquee';
import { WhyUs } from '../components/WhyUs';
import { Services } from '../components/Services';
import { Industries } from '../components/Industries';
import { DarkStats } from '../components/DarkStats';
import { Process } from '../components/Process';
import { Results } from '../components/Results';
import { Testimonials } from '../components/Testimonials';
import { FAQ } from '../components/FAQ';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';

export default function Home() {
  const { lang } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = lang;
    
    // Inject alternate language tags for SEO
    const head = document.head;
    
    // Remove old alternates
    const oldLinks = head.querySelectorAll('link[rel="alternate"][hreflang]');
    oldLinks.forEach(link => link.remove());

    const linkEn = document.createElement('link');
    linkEn.rel = 'alternate';
    linkEn.hreflang = 'en';
    linkEn.href = '/';

    const linkSr = document.createElement('link');
    linkSr.rel = 'alternate';
    linkSr.hreflang = 'sr';
    linkSr.href = '/sr';

    head.appendChild(linkEn);
    head.appendChild(linkSr);

  }, [lang]);

  return (
    <div className="relative min-h-screen bg-white">
      {/* Background Gradient */}
      <div className="absolute top-0 inset-x-0 h-[800px] bg-gradient-to-b from-slate-50 to-white -z-10" />

      <Navbar />
      
      <main>
        <Hero />
        <Marquee />
        <WhyUs />
        <Services />
        <Industries />
        <DarkStats />
        <Process />
        <Results />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
