export const languageRoutePairs = {
  '/ai-automation': '/sr/ai-automatizacije',
  '/web-development': '/sr/izrada-sajtova',
  '/ai-phone-agent': '/sr/ai-telefonski-agent',
  '/custom-ai-systems': '/sr/prilagodjeni-ai-sistemi',
  '/ai-for-dentists': '/sr/ai-za-stomatologe',
  '/ai-for-travel-agencies': '/sr/ai-za-turisticke-agencije',
  '/ai-for-law-firms': '/sr/ai-za-advokatske-kancelarije',
  '/ai-for-hotels': '/sr/ai-za-hotele',
  '/ai-for-instagram-shops': '/sr/ai-za-instagram-prodavnice',
  '/ai-for-real-estate': '/sr/ai-za-nekretnine',
  '/ai-for-service-businesses': '/sr/ai-za-servise',
  '/ai-for-ecommerce': '/sr/ai-za-ecommerce'
};

export function getLanguageHrefs(pathname) {
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
  const isSerbianPage = normalizedPath === '/sr' || normalizedPath.startsWith('/sr/');
  const matchedEnglishPath = Object.entries(languageRoutePairs).find(([, srPath]) => srPath === normalizedPath)?.[0];
  const enHref = matchedEnglishPath || (isSerbianPage ? (normalizedPath === '/sr' ? '/' : normalizedPath.replace(/^\/sr/, '')) : normalizedPath);
  const srHref = languageRoutePairs[normalizedPath] || (isSerbianPage ? normalizedPath : (normalizedPath === '/' ? '/sr' : `/sr${normalizedPath}`));

  const withTrailingSlash = (path) => path === '/' ? path : `${path}/`;

  return { enHref: withTrailingSlash(enHref), srHref: withTrailingSlash(srHref) };
}
