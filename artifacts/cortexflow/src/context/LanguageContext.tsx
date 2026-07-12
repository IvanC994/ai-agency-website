import React, { createContext, useContext } from 'react';
import type { Lang } from '../data/content';
import { content } from '../data/content';

const LanguageContext = createContext<{ lang: Lang; dict: typeof content.en }>({
  lang: 'en',
  dict: content.en,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ lang: Lang; children: React.ReactNode }> = ({ lang, children }) => {
  return (
    <LanguageContext.Provider value={{ lang, dict: content[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
};
