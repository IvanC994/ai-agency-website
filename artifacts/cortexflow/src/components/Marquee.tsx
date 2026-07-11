import { useLanguage } from '../context/LanguageContext';

export const Marquee = () => {
  const { dict } = useLanguage();
  const items = dict.marquee;

  return (
    <div className="w-full bg-white border-y border-slate-100 py-4 overflow-hidden relative flex">
      {/* Absolute pseudo elements for fade effect if desired, but pure CSS is simpler */}
      <div className="w-[150px] absolute left-0 top-0 bottom-0 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
      <div className="w-[150px] absolute right-0 top-0 bottom-0 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

      <div className="flex whitespace-nowrap animate-marquee">
        {/* Render items multiple times for seamless looping */}
        {[...Array(3)].map((_, arrayIndex) => (
          <div key={arrayIndex} className="flex items-center">
            {items.map((item, i) => (
              <div key={`${arrayIndex}-${i}`} className="flex items-center">
                <span className="text-sm font-semibold text-slate-700 tracking-wide uppercase px-8">
                  {item}
                </span>
                <span className="text-sky-500 text-[10px]">✦</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
