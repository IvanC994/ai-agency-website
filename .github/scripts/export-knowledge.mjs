import { createHash } from 'node:crypto';
import {
  mkdir,
  readFile,
  rename,
  rm,
  writeFile
} from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import turndownPluginGfm from 'turndown-plugin-gfm';

const { gfm } = turndownPluginGfm;

const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url));
const sitemapPath = join(repositoryRoot, 'public', 'sitemap.xml');
const outputDirectory = join(repositoryRoot, 'knowledge');
const temporaryDirectory = join(repositoryRoot, 'knowledge.tmp');

const canonicalOrigin = 'https://routineforge.tech';

const baseUrlArgument = process.argv.find((argument) =>
  argument.startsWith('--base-url=')
);

const baseUrl = new URL(
  baseUrlArgument
    ? baseUrlArgument.slice('--base-url='.length)
    : `${canonicalOrigin}/`
);

const serviceSlugs = new Set([
  'ai-chatbot',
  'ai-automation',
  'web-development',
  'ai-phone-agent',
  'custom-ai-systems',
  'ai-automatizacije',
  'izrada-sajtova',
  'ai-telefonski-agent',
  'prilagodjeni-ai-sistemi'
]);

const normalizeText = (value = '') =>
  value
    .replaceAll('\u00a0', ' ')
    .replace(/\s+/g, ' ')
    .trim();

const yamlString = (value) => JSON.stringify(value ?? '');

const getPageType = (slug) => {
  if (slug === 'home') return 'home';
  if (slug === 'about') return 'about';
  if (slug === 'privacy' || slug === 'terms') return 'legal';
  if (serviceSlugs.has(slug)) return 'service';
  return 'industry';
};

const getPageDetails = (pathname) => {
  const language =
    pathname === '/sr/' || pathname.startsWith('/sr/')
      ? 'sr'
      : 'en';

  let slug = pathname
    .replace(/^\/sr\/?/, '')
    .replace(/^\/+|\/+$/g, '');

  if (!slug) slug = 'home';

  return {
    language,
    slug,
    pageType: getPageType(slug)
  };
};

const convertLinksToAbsolute = ($, container, canonicalUrl) => {
  container.find('a[href]').each((_, element) => {
    const link = $(element);
    const href = link.attr('href');

    if (
      !href ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:')
    ) {
      return;
    }

    try {
      link.attr('href', new URL(href, canonicalUrl).href);
    } catch {
      link.removeAttr('href');
    }
  });
};

const sitemapXml = await readFile(sitemapPath, 'utf8');
const sitemap = cheerio.load(sitemapXml, {
  xmlMode: true
});

const sitemapEntries = [];

sitemap('url').each((_, element) => {
  const entry = sitemap(element);
  const location = normalizeText(entry.find('loc').text());
  const lastmod = normalizeText(entry.find('lastmod').text());

  if (location) {
    sitemapEntries.push({
      location,
      lastmod
    });
  }
});

if (sitemapEntries.length === 0) {
  throw new Error('No URLs were found in public/sitemap.xml.');
}

await rm(temporaryDirectory, {
  recursive: true,
  force: true
});

await mkdir(temporaryDirectory, {
  recursive: true
});

const turndown = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  emDelimiter: '_',
  strongDelimiter: '**'
});

turndown.use(gfm);

let englishCount = 0;
let serbianCount = 0;

for (const entry of sitemapEntries) {
  const canonicalUrl = new URL(entry.location);

  if (canonicalUrl.origin !== canonicalOrigin) {
    throw new Error(
      `Unexpected domain in sitemap: ${canonicalUrl.href}`
    );
  }

  const requestUrl = new URL(
    `${canonicalUrl.pathname}${canonicalUrl.search}`,
    baseUrl
  );

  console.log(`Fetching ${canonicalUrl.pathname}`);

  const response = await fetch(requestUrl, {
    redirect: 'follow',
    signal: AbortSignal.timeout(15_000),
    headers: {
      Accept: 'text/html',
      'User-Agent': 'RoutineForgeKnowledgeExporter/1.0'
    }
  });

  if (!response.ok) {
    throw new Error(
      `Page ${requestUrl.href} returned HTTP ${response.status}.`
    );
  }

  const contentType = response.headers.get('content-type') ?? '';

  if (!contentType.includes('text/html')) {
    throw new Error(
      `Page ${requestUrl.href} did not return HTML.`
    );
  }

  const finalUrl = new URL(response.url);

  if (finalUrl.origin !== baseUrl.origin) {
    throw new Error(
      `Page ${requestUrl.href} redirected to another domain.`
    );
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const mainElements = $('main');

  if (mainElements.length !== 1) {
    throw new Error(
      `Expected exactly one <main> element on ${canonicalUrl.href}, found ${mainElements.length}.`
    );
  }

  const main = mainElements.eq(0);

  main
    .find(
      [
        'form',
        'script',
        'style',
        'noscript',
        'template',
        'svg',
        'canvas',
        'iframe',
        'video',
        'audio',
        'picture',
        'img',
        'input',
        'select',
        'textarea',
        '[hidden]',
        '[aria-hidden="true"]',
        '.sr-only',
        '[data-knowledge-ignore]'
      ].join(',')
    )
    .remove();
$('[data-site-header], footer').remove();

  convertLinksToAbsolute($, main, canonicalUrl);

  const title = normalizeText(main.find('h1').first().text());
  const description = normalizeText(
    $('meta[name="description"]').attr('content') ?? ''
  );

  if (!title) {
    throw new Error(
      `No H1 title was found on ${canonicalUrl.href}.`
    );
  }

  const mainHtml = main.html();

  if (!mainHtml) {
    throw new Error(
      `No usable content was found on ${canonicalUrl.href}.`
    );
  }

  const markdown = turndown
    .turndown(mainHtml)
    .replaceAll('\u00a0', ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (markdown.length < 400) {
    throw new Error(
      `The extracted content from ${canonicalUrl.href} is unexpectedly short.`
    );
  }

  const { language, slug, pageType } = getPageDetails(
    canonicalUrl.pathname
  );

  const contentHash = createHash('sha256')
    .update(markdown)
    .digest('hex')
    .slice(0, 16);

  const frontmatter = [
    '---',
    `id: ${yamlString(`${language}:${slug}`)}`,
    `title: ${yamlString(title)}`,
    `description: ${yamlString(description)}`,
    `url: ${yamlString(canonicalUrl.href)}`,
    `language: ${yamlString(language)}`,
    `page_type: ${yamlString(pageType)}`,
    `lastmod: ${yamlString(entry.lastmod)}`,
    `content_hash: ${yamlString(contentHash)}`,
    '---',
    ''
  ].join('\n');

  const outputPath = join(
    temporaryDirectory,
    language,
    `${slug}.md`
  );

  await mkdir(dirname(outputPath), {
    recursive: true
  });

  await writeFile(
    outputPath,
    `${frontmatter}\n${markdown}\n`,
    'utf8'
  );

  if (language === 'sr') {
    serbianCount += 1;
  } else {
    englishCount += 1;
  }
}

await rm(outputDirectory, {
  recursive: true,
  force: true
});

await rename(temporaryDirectory, outputDirectory);

console.log('');
console.log(`Exported ${sitemapEntries.length} pages.`);
console.log(`English documents: ${englishCount}`);
console.log(`Serbian documents: ${serbianCount}`);
console.log('Output directory: knowledge/');