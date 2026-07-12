import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CheckCircle2 } from 'lucide-react';
import { useScrollReveal, revealStyle } from '../hooks/useScrollReveal';

export const Contact = () => {
  const { dict } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const { ref, visible } = useScrollReveal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      className="py-24 bg-white scroll-mt-20"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          style={revealStyle(visible, 0)}
          className="bg-gradient-to-br from-slate-950 to-slate-900 rounded-3xl p-10 md:p-16 lg:p-20 border border-slate-800 shadow-2xl overflow-hidden relative"
        >
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-sky-500/20 blur-[100px] rounded-full pointer-events-none" />

          <div className="grid lg:grid-cols-2 gap-16 relative z-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-6 leading-tight">
                {dict.contact.title}
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-md mb-8">
                {dict.contact.description}
              </p>
            </div>

            <div>
              {submitted ? (
                <div className="bg-slate-900/50 border border-emerald-900/50 rounded-2xl p-8 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Success</h3>
                  <p className="text-emerald-400">{dict.contact.form.success}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="text-sm font-medium text-slate-300">{dict.contact.form.name}</label>
                      <input
                        required
                        type="text"
                        id="name"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-sm font-medium text-slate-300">{dict.contact.form.email}</label>
                      <input
                        required
                        type="email"
                        id="email"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="company" className="text-sm font-medium text-slate-300">{dict.contact.form.company}</label>
                      <input
                        type="text"
                        id="company"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="text-sm font-medium text-slate-300">{dict.contact.form.phone}</label>
                      <input
                        type="tel"
                        id="phone"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="message" className="text-sm font-medium text-slate-300">{dict.contact.form.message}</label>
                    <textarea
                      required
                      id="message"
                      rows={4}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-4 px-6 rounded-xl transition-colors mt-4"
                  >
                    {dict.contact.form.submit}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
