# GEO Audit Report: RoutineForge

**Audit Date:** 2026-09-22
**URL:** routineforge.tech (Local Build Audit)
**Business Type:** Agency/Services
**Pages Analyzed:** 34

---

## Executive Summary

**Overall GEO Score: 59/100 (Poor)**

RoutineForge has an excellent technical foundation built on Astro, offering fast server-side rendering and indexability. However, it currently lacks the explicit AI-targeted content signals and schema configurations needed for high Generative Engine Optimization (GEO). The brand's entity authority is weak, and the site misses critical AI discovery files like `llms.txt`. 

### Score Breakdown

| Category | Score | Weight | Weighted Score |
|---|---|---|---|
| AI Citability | 63/100 | 25% | 15.75 |
| Brand Authority | 25/100 | 20% | 5.00 |
| Content E-E-A-T | 68/100 | 20% | 13.60 |
| Technical GEO | 90/100 | 15% | 13.50 |
| Schema & Structured Data | 30/100 | 10% | 3.00 |
| Platform Optimization | 81/100 | 10% | 8.10 |
| **Overall GEO Score** | | | **59/100** |

---

## Critical Issues (Fix Immediately)

- **Missing `sameAs` Entity Coverage**: The Organization schema only points to LinkedIn, making it hard for AI models to establish a strong knowledge graph entity for RoutineForge. *Fix: Create and link profiles on Wikidata, Crunchbase, Twitter/X, and GitHub.*
- **No `llms.txt` or `llms-full.txt`**: AI crawlers currently must parse the entire minified HTML. *Fix: Add an `llms.txt` at the root directory to provide an agent-readable summary of services and case studies.*
- **Lack of Case Studies / Demonstrated Experience**: The content is mostly theoretical capabilities, which AI systems are less likely to cite without hard data. *Fix: Add real-world metrics, named clients, or measurable outcomes to the homepage and service pages.*

## High Priority Issues

- **Missing `FAQPage` Schema**: The site has an FAQ section, but it is not wrapped in `FAQPage` JSON-LD schema, limiting its ability to appear in Google AI Overviews and Bing Copilot.
- **Missing `BreadcrumbList` Schema**: Inner pages (like `/ai-chatbot/`) lack breadcrumb schema, which helps AI engines map the site structure.
- **Lack of Individual Expertise Signals**: No "Our Team" or named author bios on the About page. Adding credentials establishes deep topical authority for AI models evaluating E-E-A-T.
- **Missing `IndexNow` Protocol**: Bing Copilot relies on IndexNow for immediate content updates, which is currently missing.

## Medium Priority Issues

- **Implicit AI Crawler Allow-listing**: While AI crawlers aren't blocked, explicitly declaring `Allow` for `OAI-SearchBot`, `ChatGPT-User`, and `PerplexityBot` in `robots.txt` acts as a positive signal.
- **No `WebSite` and `SearchAction` Schema**: Adding this to the homepage provides better sitelinks and search context.
- **No `speakable` Schema**: Implementing `speakable` on core service pages will help optimize for voice-based AI assistants.

## Low Priority Issues

- **Security Headers**: Standard security headers (CSP, HSTS, X-Frame-Options) should be defined in your deployment platform settings (e.g. `_headers`).
- **Content-Signal Directive**: Consider adding a `Content-Signal:` directive to `robots.txt` to explicitly manage AI training and search permissions.

---

## Category Deep Dives

### AI Citability (63/100)
The site's descriptions are clear and concise, making them scannable. However, they lack the statistical density ("reduced call volume by X%") that LLMs prefer when citing authoritative sources. The homepage hero section is very marketing-heavy and less likely to be quoted verbatim by AI.

### Brand Authority (25/100)
Brand presence across external platforms is minimal. No Wikipedia entity or Reddit discussions exist. YouTube presence is low. The name "RoutineForge" also collides with a few other unrelated projects, meaning the entity needs to be actively strengthened through social profiles and PR.

### Content E-E-A-T (68/100)
Topical authority is strong due to the hub-and-spoke model of 8 industry-specific pages and 5 service pages. Trustworthiness is exceptionally high due to the excellent use of Organization schema containing the tax ID, physical address, and contact methods. However, the site lacks "Experience" (case studies, results) and "Expertise" (named authors, technical deep-dives).

### Technical GEO (90/100)
Built with Astro (SSG), the site is incredibly fast and fully server-rendered, guaranteeing perfect access for AI crawlers without JavaScript execution delays. Meta tags and canonicals are perfectly configured. Security headers are the only minor missing piece.

### Schema & Structured Data (30/100)
While the Organization schema is perfectly valid, the site is missing the broader schema ecosystem required for GEO: `FAQPage` for the FAQs, `BreadcrumbList` for inner pages, and an expanded `sameAs` array to solidify the brand's entity graph.

### Platform Optimization (81/100)
ChatGPT Web Search and Google Gemini readiness are excellent due to the clean semantic structure. Google AI Overviews and Bing Copilot lag slightly due to the lack of `FAQPage` schema and `IndexNow` integration. 

---

## Quick Wins (Implement This Week)

1. Create a simple `/llms.txt` file summarizing the 5 core services and 8 industry verticals.
2. Add `FAQPage` JSON-LD structured data to wrap the existing FAQ questions and answers.
3. Explicitly add `User-agent: OAI-SearchBot` and `User-agent: PerplexityBot` to `robots.txt`.
4. Add an `IndexNow` text file to the root for instant Bing indexing.

## 30-Day Action Plan

### Week 1: Entity & Schema Foundation
- [ ] Expand `sameAs` in Organization schema to include Wikidata, X, and Crunchbase.
- [ ] Add `BreadcrumbList` schema to all service and industry pages.
- [ ] Add `FAQPage` schema to the FAQ section.

### Week 2: AI Readability
- [ ] Write and deploy `/llms.txt` and `/llms-full.txt`.
- [ ] Update `robots.txt` with explicit AI crawler allows and `Content-Signal`.
- [ ] Implement `WebSite` schema with `SearchAction` on the homepage.

### Week 3: Content E-E-A-T
- [ ] Draft a "Case Studies" or "Success Stories" section with measurable outcomes.
- [ ] Update the About page to include named team members and their credentials.
- [ ] Inject statistical data points into the homepage copy to improve citability.

### Week 4: Platform Authority
- [ ] Implement the `IndexNow` protocol for Bing.
- [ ] Create a company Wikidata entry to solidify the Knowledge Graph entity.
- [ ] Publish an authoritative, technical blog post on AI automation to establish expertise.

---

## Appendix: Pages Analyzed

| URL | Title | Type |
|---|---|---|
| / | AI automation and digital systems for modern businesses \| RoutineForge | Homepage |
| /ai-chatbot/ | ... | Service Page |
| /ai-automation/ | ... | Service Page |
| /web-development/ | ... | Service Page |
| /ai-phone-agent/ | ... | Service Page |
| /custom-ai-systems/ | ... | Service Page |
| /ai-for-dentists/ | ... | Industry Page |
| /ai-for-law-firms/ | ... | Industry Page |
| ... | (26 additional pages, including translated /sr/ routes) | ... |
