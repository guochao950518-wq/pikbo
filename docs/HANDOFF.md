# Handoff log — quality work others should reuse

Newest first. One block per meaningful landing.

---

### 2026-07-22 — [grok] collab protocol
- Paths: `COLLAB.md`, `docs/STATUS.md`, `docs/HANDOFF.md`, `AGENTS.md`
- Why: three agents can sync via GitHub without thrashing
- Reuse: always `git pull` + read STATUS before coding

### 2026-07-22 — [grok] guest credits + checkout scaffolding
- Paths: `lib/session.ts`, `lib/credits.ts`, `lib/pricing.ts`, `app/api/me`, `app/api/generate`, `app/api/checkout`, `app/pricing`, `components/CreateStudio.tsx`
- Why good: no DB required; 402 when out of credits; free watermark flag; Stripe-ready; dev upgrade without keys
- Reuse rules:
  - Deduct credits **before** fal call; **refund** on failure
  - Free plan → `watermark: true`; paid → false
  - Keep `CREDITS_PER_VIDEO = 10` unless pricing doc updates
  - Demo mode (no `FAL_KEY`) must still deduct/refund consistently

### 2026-07-22 — [mixed] 3-axis pSEO
- Paths: `lib/presets.ts`, `lib/usecases.ts`, `lib/toytypes.ts` + `app/effects|for|toys`
- Why good: effects × seller use-cases × toy types internal link mesh
- Reuse: new preset = studio effect **and** SEO page fields; cross-link from usecases

---

## Template

```md
### YYYY-MM-DD — [agent] title
- Paths:
- Why good:
- Reuse / pitfalls:
- Depends on:
```
