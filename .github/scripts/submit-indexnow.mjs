import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sitemapEntries } from '../../sitemap.config.mjs';

const siteUrl = new URL('https://routineforge.tech/');
const endpoint = 'https://api.indexnow.org/indexnow';
const keyFileName = '97e2a716733ec655846f434d6e38718b.txt';
const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));
const keyPath = join(repositoryRoot, 'public', keyFileName);
const keyLocation = new URL(keyFileName, siteUrl).href;

const componentRoutes = new Map([
  ['AboutPage.astro', ['/about/', '/sr/about/']],
  ['AIChatbotPage.astro', ['/ai-chatbot/', '/sr/ai-chatbot/']],
  ['AIAutomationPage.astro', ['/ai-automation/', '/sr/ai-automatizacije/']],
  ['WebDevelopmentPage.astro', ['/web-development/', '/sr/izrada-sajtova/']],
  ['AIPhoneAgentPage.astro', ['/ai-phone-agent/', '/sr/ai-telefonski-agent/']],
  ['CustomAISystemsPage.astro', ['/custom-ai-systems/', '/sr/prilagodjeni-ai-sistemi/']],
  ['DentalPracticesPage.astro', ['/ai-for-dentists/', '/sr/ai-za-stomatologe/']],
  ['TravelAgenciesPage.astro', ['/ai-for-travel-agencies/', '/sr/ai-za-turisticke-agencije/']],
  ['LawFirmsPage.astro', ['/ai-for-law-firms/', '/sr/ai-za-advokatske-kancelarije/']],
  ['HotelsPage.astro', ['/ai-for-hotels/', '/sr/ai-za-hotele/']],
  ['InstagramShopsPage.astro', ['/ai-for-instagram-shops/', '/sr/ai-za-instagram-prodavnice/']],
  ['RealEstatePage.astro', ['/ai-for-real-estate/', '/sr/ai-za-nekretnine/']],
  ['ServiceBusinessesPage.astro', ['/ai-for-service-businesses/', '/sr/ai-za-servise/']],
  ['EcommercePage.astro', ['/ai-for-ecommerce/', '/sr/ai-za-ecommerce/']]
]);

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const argumentValue = (name) => process.argv.find((argument) => argument.startsWith(`${name}=`))?.slice(name.length + 1);

const pageRouteFromFile = (file) => {
  if (file === 'src/pages/index.astro') return '/';
  if (file === 'src/pages/sr.astro') return '/sr/';
  if (!file.startsWith('src/pages/') || !file.endsWith('.astro') || file.includes('[')) return null;

  const route = file
    .slice('src/pages/'.length, -'.astro'.length)
    .replaceAll('\\', '/')
    .replace(/(^|\/)index$/, '$1');

  return `/${route.replace(/^\/+|\/+$/g, '')}/`.replace('//', '/');
};

const getChangedFiles = () => {
  const before = argumentValue('--before') || process.env.INDEXNOW_BEFORE?.trim();
  const after = argumentValue('--after') || process.env.INDEXNOW_AFTER?.trim();
  if (!before || !after || /^0+$/.test(before)) return null;

  try {
    return execFileSync('git', ['diff', '--name-only', '--diff-filter=ACDMRTUXB', before, after], {
      cwd: repositoryRoot,
      encoding: 'utf8'
    }).split(/\r?\n/).map((file) => file.trim()).filter(Boolean);
  } catch (error) {
    console.warn(`Could not determine changed files; submitting the sitemap instead. ${error.message}`);
    return null;
  }
};

const selectUrls = (sitemapUrls, changedFiles, submitAll) => {
  if (submitAll || !changedFiles) return sitemapUrls;

  const selected = new Set();
  let globalChange = false;

  for (const file of changedFiles) {
    if (
      file.startsWith('src/layouts/') ||
      file.startsWith('src/styles/') ||
      file.startsWith('src/config/') ||
      file.startsWith('public/') ||
      ['astro.config.mjs', 'package.json', 'package-lock.json', 'wrangler.jsonc'].includes(file)
    ) {
      globalChange = true;
      break;
    }

    const mappedRoutes = componentRoutes.get(basename(file));
    if (mappedRoutes) {
      mappedRoutes.forEach((route) => selected.add(new URL(route, siteUrl).href));
      continue;
    }

    const pageRoute = pageRouteFromFile(file);
    if (pageRoute) {
      selected.add(new URL(pageRoute, siteUrl).href);
      continue;
    }

    if (file.startsWith('src/components/')) {
      globalChange = true;
      break;
    }
  }

  return globalChange ? sitemapUrls : [...selected];
};

const waitForKey = async (key, timeoutSeconds = 240) => {
  const startedAt = Date.now();

  while ((Date.now() - startedAt) / 1000 < timeoutSeconds) {
    try {
      const response = await fetch(keyLocation, { cache: 'no-store' });
      if (response.ok && (await response.text()).trim() === key) return;
    } catch {
      // The deployment may still be propagating.
    }
    await sleep(10_000);
  }

  throw new Error(`IndexNow key was not available at ${keyLocation} after ${timeoutSeconds} seconds.`);
};

const key = (await readFile(keyPath, 'utf8')).trim();
if (!/^[A-Za-z0-9-]{8,128}$/.test(key)) throw new Error('The IndexNow key has an invalid format.');

const sitemapUrls = sitemapEntries.map(({ path }) => new URL(path, siteUrl).href);
const changedFiles = getChangedFiles();
const submitAll = process.argv.includes('--all');
const dryRun = process.argv.includes('--dry-run');
const urlList = selectUrls(sitemapUrls, changedFiles, submitAll)
  .filter((url) => new URL(url).host === siteUrl.host);

if (!urlList.length) {
  console.log('No public page URLs changed; IndexNow submission skipped.');
  process.exit(0);
}

const payload = {
  host: siteUrl.host,
  key,
  keyLocation,
  urlList
};

if (dryRun) {
  console.log(`IndexNow dry run: ${urlList.length} URL(s) selected.`);
  console.log(JSON.stringify(payload, null, 2));
  process.exit(0);
}

const deployDelaySeconds = Number(process.env.INDEXNOW_DEPLOY_DELAY_SECONDS || 0);
if (deployDelaySeconds > 0) {
  console.log(`Waiting ${deployDelaySeconds} seconds for the Cloudflare deployment.`);
  await sleep(deployDelaySeconds * 1000);
}

await waitForKey(key);

const response = await fetch(endpoint, {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload)
});

if (![200, 202].includes(response.status)) {
  const responseText = await response.text();
  throw new Error(`IndexNow returned HTTP ${response.status}${responseText ? `: ${responseText}` : ''}`);
}

console.log(`IndexNow accepted ${urlList.length} URL(s) with HTTP ${response.status}.`);
