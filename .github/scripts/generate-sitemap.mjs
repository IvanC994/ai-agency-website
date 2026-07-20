import { execFileSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sitemapEntries } from '../../sitemap.config.mjs';

const siteUrl = new URL('https://routineforge.tech/');
const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));
const sitemapPath = join(repositoryRoot, 'public', 'sitemap.xml');
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

await writeFile(sitemapPath, sitemap, 'utf8');
console.log(`Generated sitemap.xml with ${sitemapEntries.length} canonical URLs.`);
