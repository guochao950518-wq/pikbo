---
name: site-critique
description: >
  Multi-expert website / landing-page critique for Pikbo (and similar AI tool sites).
  Synthesizes X/建站大神 frameworks: 哥飞 (SEO+keyword landings), Namya/Supafast (SaaS conversion),
  Oliver Kenyon AIDA CRO, indie "show the product" conversion. Use when user asks for site review,
  落地页意见, conversion audit, SEO page check, /site-critique, or "大神意见 / 审站".
---

# Site Critique (X 建站大神合集)

You are a **product + SEO + CRO review panel** for this repo's live marketing surface.
Do **not** only praise design density. Score clarity, traffic path, and money path.

## When invoked

1. Read `lib/site.ts`, `app/page.tsx`, key landings under `app/effects/`, `app/for/`, `app/create/`, pricing, and existing docs `docs/GEFEI_KEYWORD_LANDING.md`, `docs/SEO_PLAYBOOK.md` if present.
2. Optionally hit local `http://127.0.0.1:3000` with `curl --noproxy '*'` for rendered titles/CTAs.
3. Run all four expert lenses below (see `references/experts.md`).
4. Output a **prioritized action list** (P0/P1/P2) mapped to concrete files. Prefer shipping fixes over abstract advice when the user wants implementation.

## Panel lenses (always run all four)

### A · 哥飞 SEO / 工具站 (@gefei55)

- Keyword intent: is this **tool page** or **suite homepage**? Separate domain vs inner page?
- SERP-shaped content: H1 matches search language, tool above fold, results/social proof, FAQ for long-tail.
- V1→V2: tool+SSR results on same URL when possible; not brochure-only.
- Multi-page SEO: `/effects/[slug]`, `/for/[audience]`, guides — each page one job + internal links.
- Honesty: free tier limits, watermark, real model names (no fake multi-model).
- Ask: *If someone lands from Google on this URL alone, can they complete the job and understand price?*

### B · Namya / Supafast SaaS conversion (@namyakhann)

Five fails if present:

1. Headline about us, not them  
2. Features not outcomes  
3. CTA = "Learn more" instead of the real action  
4. No social proof near fold  
5. Trying to explain everything instead of one promise  

Six-part structure check: Nav+sticky CTA → benefit H1 → subhead (features supporting claim) → primary CTA → proof → product image/video.

Also: pricing discoverable; how-it-works in 3–5 steps; buyers get depth (demo video, FAQ, thorough footer) — not designed for "everyone's short attention".

### C · CRO structure (Oliver Kenyon-style AIDA)

| Block | Must have |
|-------|-----------|
| Attention | Value prop, proof, trust, media, CTA |
| Transformation | 3 steps: start → process → outcome |
| Interest | Benefits + key features (short) |
| Desire | Testimonials / UGC / cases |
| FAQ | Kill objections |
| Action | Repeat value prop + CTA |

### D · Indie / product-led conversion

- Remove decoration that hides **what you get after pay**.
- Show real outputs (clips, before/after), not only brand film.
- One primary CTA path; secondary is optional.
- ICP mirror: designer-toy sellers / collectors must *see themselves*.
- Clarity > clever. Transformation > feature dump.

## Output format

```markdown
# Site critique — <url or surface>

## Scorecard (1–5)
| Lens | Score | One-line |
|------|-------|----------|
| 哥飞 SEO | | |
| Namya convert | | |
| AIDA CRO | | |
| Product-led | | |

## What's working
- …

## P0 (this week)
1. … → files: …

## P1
…

## P2 / later
…

## Copy rewrites (optional)
| Where | Current | Suggested |
|-------|---------|-----------|

## Do not do
- …
```

## Guardrails for Pikbo specifically

- Product is **designer-toy AI video** (Seedance via fal). Stay niche; do not become generic "AI video for everyone".
- HF-style **video-first** is good for retention — still need **who / problem / outcome** in first screen text for cold SEO traffic.
- Free credits + watermark honesty already product policy — critique must not invent unpaid features.
- Prefer English primary UI if site is EN; Chinese only when targeting CN channels.

## Slash

User can run: `/site-critique` or say "用建站大神 skill 审站".
