# Handoff log — quality work others should reuse

Newest first. One block per meaningful landing.

---

### 2026-07-23 — [gpt] conversion truth + unit economics (C1–C3 / T25–T26)
- Paths: `docs/UNIT_ECONOMICS.md` plus the C1/C2 truth-label surfaces already reviewed in PR #6.
- Decision: replace three anonymous monthly free clips with one verified 4s/480p/watermarked trial.
- Economics: Creator `$19` supports about five 5s Fast 720p or four 5s Standard 720p clips, not 50, at the reviewed fal rates.
- Reuse: charge credits by model + resolution + duration; implementation belongs with Grok's server-side ledger and must not be a UI-only estimate.
- Verified: official fal/Stripe sources linked, arithmetic sensitivity included, ESLint and Next production build run on the combined C1–C3 branch.

### 2026-07-23 — [gpt] Claude promise-consistency audit (T23)
- Paths: `app/page.tsx`, `app/explore`, `app/community`, `app/apps`, `app/models`, `app/pricing`, `components/HeroVideoBanner.tsx`, `components/SeedanceCampaign.tsx`, `components/PresetPreviewCard.tsx`, `lib/videoFeed.ts`, `lib/site.ts`
- Why good: separates cached PIKBO Lab examples, shared motion backdrops, concept recipes, configured workspaces, and provider-backed live generation instead of presenting all five as the same proof.
- Reuse / pitfalls:
  - `live` in the catalog means an implemented workspace, not proof that provider credentials exist; UI now says `Configured`/`Wired` where appropriate.
  - Presets without an exact `DemoVideo.preset` match retain a dense visual preview but must show `Concept · shared loop`.
  - Community remains `PIKBO Lab` until real accounts and submissions exist; do not add fictional authors or engagement.
  - `StatusBadge` is the runtime source for `Seedance live` versus `Demo mode`; static marketing copy should not override it.
- Verified: ESLint clean; Next.js 16 production build passed with 69 routes.

### 2026-07-23 — [grok] three-agent max push + CI + generate honesty
- Paths: `docs/DISPATCH.md`, `docs/STATUS.md`, `.github/workflows/ci.yml`, `components/CreateStudio.tsx`
- Why: boss wants Grok+Codex+Claude at full capacity; shared board is the coordination channel.
- Reuse:
  - Codex: only DISPATCH C1–C5; branch `agent/gpt/convert-truth`
  - Claude: only DISPATCH L1–L4; branch `agent/claude/copy-seo-v2`
  - Do not invent fake community clips; Official/Cached labels stay.
  - Generate result strip explains demo vs live and refund-on-fail.
- CI: push/PR runs lint + build + conflict-marker scan.

### 2026-07-22 — [gpt] pricing conversion + usage estimator (T21)
- Paths: `app/pricing/page.tsx`, `components/PricingUsageEstimator.tsx`
- Why good: turns a static three-card page into a transparent monthly-output calculator, recommendation flow, plan comparison table, and clear FAQ while preserving the real checkout buttons.
- Reuse / pitfalls:
  - Recommendations intentionally match current allowances: Free up to 3 clips, Creator up to 50, Shop up to 150 at `CREDITS_PER_VIDEO = 10`.
  - The calculator is illustrative of included credits, not a quote for model overages; keep wording tied to the current credit estimate.
  - No annual toggle or unlimited claim exists because neither billing mode is implemented.
  - Checkout stays in `PricingCheckoutButton`; do not duplicate Stripe logic inside the estimator.
- Verified: production build; desktop and 390px visual passes; quick choices switch Creator → Shop correctly; no browser warnings/errors.
- Depends on: `PLANS`, `CREDITS_PER_VIDEO`, existing Stripe checkout component. No checkout API, credits, session, entitlement, or webhook code changed.

### 2026-07-22 — [gpt] live model shelf + demo-aware preset wall (T12)
- Paths: `app/page.tsx`, `components/HomeModelShelf.tsx`, `components/PresetPreviewCard.tsx`, `components/PresetsWall.tsx`
- Why good: live Seedance cards use cached toy footage on hover/focus, while Kling/Veo stay visibly marked `Roadmap`; six presets with matching T2 assets show real video/posters and all remaining presets stay honest `Recipe` cards.
- Reuse / pitfalls:
  - `MODEL_DEMOS` is presentation-only. Cached previews do not prove which provider rendered them and must retain the `Cached preview` badge.
  - Preset video matching is by `DemoVideo.preset`; adding a verified demo automatically upgrades that recipe card without changing the wall.
  - Touch layouts intentionally keep posters still; the immersive T2 showcase remains the single autoplay surface on mobile.
  - Do not mark a roadmap model live until its generate route/provider capability is wired.
- Verified: production build; desktop and 390px model/preset visual passes; no browser warnings/errors.
- Depends on: T2 `DemoVideo` registry, shared `MODELS` catalog, Claude `PresetsWall`. No generation, credits, history, batch, session, or billing code changed.

### 2026-07-22 — [gpt] toy-first homepage demo theatre (T2)
- Paths: `app/page.tsx`, `components/HomeDemoShowcase.tsx`, `lib/demoVideos.ts`, `public/demos/`
- Why good: replaces the model-name-only hero with a real encoded before/after stage and six playable toy clips while preserving the shared AppShell, Apps, Models, Cinema, Supercomputer, PresetsWall, community, Library, and billing paths. Copy stays vertical to owned-toy photos and makes Free watermark, trial allowance, and subscription expansion explicit.
- Reuse / pitfalls:
  - Demo assets are cached original PIKBO prototype footage, so playback never calls fal or spends credits. Do not relabel them as newly generated model output.
  - `DemoVideo` IDs and `/create?effect=...` deep links are the stable contract; verified fal renders can replace the files later without rebuilding the component.
  - Hero preloads one clip; gallery clips use posters plus viewport/hover playback, pause off-screen, and honor reduced-motion preferences.
  - Keep both MP4 and WebM plus a poster for every replacement clip.
- Verified: production build; 1440px and 390px browser passes; Studio deep-link selects `Floating Hero`; no browser warnings/errors.
- Depends on: latest shared AppShell/catalog home, existing preset slugs, and Create Studio query-param selection. No credits, session, generate API, history, or billing code changed.

### 2026-07-22 — [claude] +4 viral presets (density)
- Paths: `lib/presets.ts` (+smoke-burst-entrance, +paint-splash, +power-aura, +hologram-glitch)
- Why good: 4 distinct high-impact viral effects for the presets wall / clone density; each is a studio effect AND SEO page (full fields + promptTemplate). No IP/brand, no human-hand generation. Now 22 effects.
- Reuse / pitfalls: data-only → auto pages+sitemap+wall+footer; keep prompts on the user's own figure; quality-first, avoid thin duplicates.

### 2026-07-22 — [grok] Library history + denser HF-class home
- Paths: `lib/history.ts`, `components/LibraryGrid.tsx`, `CreateStudio` pushHistory, `app/page.tsx` + PresetsWall, pricing app padding
- Why: generate → appears in Library (device-local); home matches model shelf + viral wall pattern
- Reuse: don't replace localStorage until Supabase; keep `pushHistory` on successful generate only

### 2026-07-22 — [grok] ByteDance Seedance as default video model
- Paths: `lib/models.ts`, `app/api/generate/route.ts`, `.env.example`
- Why: boss wants 字节模型出片. Defaults are Seedance 2.0 full (paid) + Fast (free) on fal.
- Reuse: change models only via `FAL_MODEL` / `FAL_MODEL_FREE`; keep input `prompt` + `image_url` + duration/aspect/resolution.
- Cost: Seedance is not free — always meter credits; free tier uses Fast + 480p + no audio.

### 2026-07-22 — [grok] Stripe billing + entitlements (T4)
- Paths: `lib/entitlements.ts`, `lib/stripe.ts`, `lib/session.ts` (merge), `app/api/webhooks/stripe`, `app/api/checkout`, `app/api/checkout/confirm`, CreateStudio confirm on return, `/privacy` `/terms`, homepage pipeline demo
- Why good: real subscription path without Supabase yet. Webhooks update durable plan; browser confirm upgrades cookie; credits not clobbered on every request (periodKey reset only).
- Reuse / pitfalls:
  - Set `STRIPE_SECRET_KEY`, `STRIPE_PRICE_*`, `STRIPE_WEBHOOK_SECRET`
  - Webhook URL: `/api/webhooks/stripe`
  - Entitlements file default `data/entitlements.json` (gitignored); serverless should move to Redis/Supabase (T5)
  - Never overwrite cookie credits from entitlement unless `periodKey` changes or free→paid upgrade
- Depends on: existing pricing plans + cookie session

### 2026-07-22 — [claude] guides / informational content axis (T11)
- Paths: `lib/guides.ts` (3 articles), `app/guides/page.tsx` (index), `app/guides/[slug]/page.tsx` (article + Article/FAQ JSON-LD), `app/sitemap.ts` (+guides), `components/Footer.tsx` (+Guides link)
- Why good: adds a 4th, top-of-funnel keyword axis (informational how-to / tips / ideas) that funnels readers into /create + related effects. Data-driven — add a `Guide` object to get a new page + sitemap entry. Build green (52 static pages).
- Reuse / pitfalls: keep `relatedEffects` to valid preset slugs; write genuinely useful prose (no thin filler) or it won't rank; guides link out to effects to spread internal-link equity. Footer Guides link makes them crawlable from every page.
- Depends on: `getPreset` + `PresetCard`.

### 2026-07-22 — [claude] effect preset expansion (T9)
- Paths: `lib/presets.ts` (+assemble-reveal, +paparazzi-flash, +kaiju-rampage); internal-link rewire in `lib/toytypes.ts` (model-kits, action-figures) + `lib/usecases.ts` (instagram)
- Why good: 3 distinct high-intent viral/scene effects, each a studio effect **and** full SEO landing page (h1/title/description/faq/promptTemplate). Quality over quantity — no keyword padding. Cross-linked from relevant toy-type/use-case pages so new effects get inbound internal links.
- Reuse / pitfalls: a new preset needs a valid `category` (showcase/unboxing/comealive/scene) so the hub + homepage group it; keep `promptTemplate` emphasizing the user's real figure (no brand replication). Append order doesn't matter — pages group by category.
- Depends on: `/effects/[slug]` route + `presetsByCategory`.

### 2026-07-22 — [claude] long-tail SEO expansion (T3)
- Paths: `lib/usecases.ts` (+whatnot-live-selling, +depop-shop-videos), `lib/toytypes.ts` (+vinyl-figures, +resin-sofubi, +model-kits)
- Why good: extends the Use-case + Toy-type axes into distinct long-tail intents (live-selling / resale platforms; vinyl / sofubi / gunpla subcultures) picked from competitor-page keyword research. Data-only change → auto-generates pages + sitemap + footer.
- Reuse / pitfalls: to add a page, append one object to the array — page, sitemap, footer come free. Keep each entry's `recommendedEffects` to valid preset slugs (cross-link mesh). Keep prompts/content genuinely distinct to avoid thin-content; don't add brand-name (trademark) slugs.
- Depends on: existing `/for/[slug]` and `/toys/[slug]` route components.

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
