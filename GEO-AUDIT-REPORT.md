# GEO Audit Report: RoutineForge

**Audit Date:** 2026-09-22
**URL:** https://routineforge.tech/ (Simulated Local Build)
**Business Type:** Agency/Services

---

## Executive Summary

**Overall GEO Score: 61/100 (Fair)** *[Up from 51/100]*

RoutineForge has an absolutely stellar technical and structural foundation. The implementation of `llms.txt`, `llms-full.txt`, semantic HTML (Astro), `robots.txt` routing, and widespread `Speakable` and `BreadcrumbList` schemas means AI engines can parse the site flawlessly. The overall score is now completely bottlenecked by off-site realities: the agency lacks a verified third-party footprint (Brand Authority) and real-world statistical case studies (E-E-A-T). For a site explicitly protecting its IP by blocking training bots (`GPTBot`, `ClaudeBot`), it is perfectly optimized for the real-time search bots that remain allowed.

### Score Breakdown

| Category | Score | Weight | Weighted Score |
|---|---|---|---|
| AI Citability | 77/100 | 25% | 19.25 |
| Brand Authority | 10/100 | 20% | 2.00 |
| Content E-E-A-T | 64/100 | 20% | 12.80 |
| Technical GEO | 98/100 | 15% | 14.70 |
| Schema & Structured Data | 47/100 | 10% | 4.70 |
| Platform Optimization | 75/100 | 10% | 7.50 |
| **Overall GEO Score** | | | **61/100** |

---

## Critical Issues (Fix Immediately)
*No critical technical issues remain. All critical issues are now external/brand-related.*

- **Missing `sameAs` Entity Coverage:** The site lacks a Knowledge Graph anchor. (User explicitly parked this item).
- **Lack of Case Studies / Demonstrated Experience:** No named clients, real-world metrics, or original data for AI models to cite as factual evidence. (User explicitly parked this item).

## High Priority Issues

- **Missing `SearchAction` Schema:** You intentionally omitted the `SearchAction` block from the `WebSite` schema because the site has no search bar. This docks your schema score, but it is the correct, safe decision to avoid broken sitelinks in Google.
- **Lack of Individual Expertise Signals:** No "Our Team" or named author bios on the About page.

## Medium Priority Issues

- **Crawlers Blocked Impact:** You successfully blocked `GPTBot` and `ClaudeBot` to prevent AI training. The audit confirms this block is working perfectly, but notes that blocking foundational training naturally limits long-term "ambient" knowledge of your brand in future model weights.

## Low Priority Issues
- **Title Tag Length:** The homepage title tag is ~72 characters ("AI automation and digital systems for modern businesses | RoutineForge"). Ideal length is under 60 characters to prevent truncation in traditional search.

---

## Category Deep Dives

### AI Citability (77/100)
Excellent structural citability. The Q&A formats on the service pages ("RoutineForge AI business automation connects CRM...") provide perfect "Answer Targets" for real-time extraction.

### Brand Authority (10/100)
The weakest link. Zero presence on Reddit, Wikipedia, Clutch, or G2. AI models have no third-party validation that the agency is reputable beyond the site's own claims.

### Content E-E-A-T (64/100)
High Trustworthiness (clear business registration, tax ID, physical address). Lacks "Experience" (case study metrics) and "Expertise" (team credentials).

### Technical GEO (98/100)
Flawless. Cloudflare security headers are injected via `_headers`. SSG rendering via Astro means 0 JS execution is required. `robots.txt` cleanly directs AI search traffic while blocking scrapers.

### Schema & Structured Data (47/100)
Schema is structurally valid but sparse. `Speakable` and `BreadcrumbList` are active. The score is suppressed due to missing `sameAs` profiles and the intentional omission of `SearchAction`.

### Platform Optimization (75/100)
- **Google AI Overviews (85/100):** Strongest platform due to FAQ structure and fast loading.
- **ChatGPT Web Search (80/100):** High readiness thanks to `llms-full.txt` and explicit bot allow-listing.

---

## Appendix: Pages Analyzed
- `index.html`
- `sr/index.html`
- `ai-chatbot/index.html`
- `ai-automation/index.html`
- ... (and 29 other statically rendered HTML files).
