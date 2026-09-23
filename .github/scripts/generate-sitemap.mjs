import { execFileSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sitemapEntries } from '../../sitemap.config.mjs';

const siteUrl = new URL('https://routineforge.tech/');
const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));
const sitemapPath = join(repositoryRoot, 'public', 'sitemap.xml');
const redirectsPath = join(repositoryRoot, 'public', '_redirects');
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

const escapeXml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

const runGit = (args) => execFileSync('git', args, {
  cwd: repositoryRoot,
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'ignore']
}).trim();

const getLastModified = (sources, fallbackLastmod) => {
  try {
    const dirtySources = runGit(['status', '--porcelain', '--', ...sources]);
    if (dirtySources) return new Date().toISOString().slice(0, 10);

    const committedDate = runGit(['log', '-1', '--format=%cs', '--', ...sources]);
    if (isoDatePattern.test(committedDate)) return committedDate;
  } catch {
    // Git metadata may be unavailable in some build environments.
  }

  return fallbackLastmod;
};

import fs from 'node:fs';

const blogDirs = [
  { path: 'src/content/blog/en', prefix: '/blog/', indexSource: 'src/pages/blog/index.astro' },
  { path: 'src/content/blog/sr', prefix: '/sr/blog/', indexSource: 'src/pages/sr/blog/index.astro' }
];

for (const dir of blogDirs) {
  const fullPath = join(repositoryRoot, dir.path);
  if (fs.existsSync(fullPath)) {
    const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
    for (const file of files) {
      const slug = file.replace(/\.mdx?$/, '');
      sitemapEntries.push({
        path: `${dir.prefix}${slug}/`,
        sources: [`${dir.path}/${file}`],
        fallbackLastmod: new Date().toISOString().slice(0, 10)
      });
    }
    sitemapEntries.push({
      path: dir.prefix,
      sources: [dir.indexSource],
      fallbackLastmod: new Date().toISOString().slice(0, 10)
    });
  }
}

const citiesDataPath = join(repositoryRoot, 'src/data/cities.json');
if (fs.existsSync(citiesDataPath)) {
  const cities = JSON.parse(fs.readFileSync(citiesDataPath, 'utf8'));
  for (const city of cities) {
    sitemapEntries.push({
      path: `/locations/${city.slug}/`,
      sources: ['src/pages/locations/[city].astro', 'src/data/cities.json'],
      fallbackLastmod: new Date().toISOString().slice(0, 10)
    });
    sitemapEntries.push({
      path: `/lokacije/${city.slug}/`,
      sources: ['src/pages/lokacije/[city].astro', 'src/data/cities.json'],
      fallbackLastmod: new Date().toISOString().slice(0, 10)
    });
  }
  sitemapEntries.push({
    path: '/locations/',
    sources: ['src/pages/locations/index.astro', 'src/data/cities.json'],
    fallbackLastmod: new Date().toISOString().slice(0, 10)
  });
  sitemapEntries.push({
    path: '/lokacije/',
    sources: ['src/pages/lokacije/index.astro', 'src/data/cities.json'],
    fallbackLastmod: new Date().toISOString().slice(0, 10)
  });
}

const workflowsDataPath = join(repositoryRoot, 'src/data/workflows.json');
if (fs.existsSync(workflowsDataPath)) {
  const workflows = JSON.parse(fs.readFileSync(workflowsDataPath, 'utf8'));
  for (const workflow of workflows) {
    sitemapEntries.push({
      path: `/workflows/${workflow.slug}/`,
      sources: ['src/pages/workflows/[workflow].astro', 'src/data/workflows.json'],
      fallbackLastmod: new Date().toISOString().slice(0, 10)
    });
    sitemapEntries.push({
      path: `/procesi/${workflow.slug}/`,
      sources: ['src/pages/procesi/[workflow].astro', 'src/data/workflows.json'],
      fallbackLastmod: new Date().toISOString().slice(0, 10)
    });
  }
  sitemapEntries.push({
    path: '/workflows/',
    sources: ['src/pages/workflows/index.astro', 'src/data/workflows.json'],
    fallbackLastmod: new Date().toISOString().slice(0, 10)
  });
  sitemapEntries.push({
    path: '/procesi/',
    sources: ['src/pages/procesi/index.astro', 'src/data/workflows.json'],
    fallbackLastmod: new Date().toISOString().slice(0, 10)
  });
}

const urls = sitemapEntries.map(({ path, sources, fallbackLastmod }) => {
  const location = new URL(path, siteUrl).href;
  const lastmod = getLastModified(sources, fallbackLastmod);

  return [
    '  <url>',
    `    <loc>${escapeXml(location)}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    '  </url>'
  ].join('\n');
}).join('\n');

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  urls,
  '</urlset>',
  ''
].join('\n');

const trailingSlashRedirects = sitemapEntries
  .map(({ path }) => path)
  .filter((path) => path !== '/' && path.endsWith('/'))
  .map((path) => `${path.slice(0, -1)} ${path} 308`)
  .join('\n');

await Promise.all([
  writeFile(sitemapPath, sitemap, 'utf8'),
  writeFile(redirectsPath, `${trailingSlashRedirects}\n`, 'utf8')
]);

console.log(
  `Generated sitemap.xml with ${sitemapEntries.length} canonical URLs and ` +
  `${sitemapEntries.length - 1} permanent trailing-slash redirects.`
);
