# Handoff log — quality work others should reuse

Newest first. One block per meaningful landing.

---

### 2026-07-22 — [gpt] product foundation: async jobs, durable credits, auth, Studio and billing safety (T5/T6/T8/T22)
- Paths: `lib/product-*`, `lib/supabaseAuth.ts`, `lib/videoWatermark.ts`, `app/api/generations`, `app/api/assets`, `app/api/auth`, `app/api/webhooks/fal`, `supabase/migrations/202607220001_product_foundation.sql`, `components/CreateStudio.tsx`, `components/BatchStudio.tsx`, `components/LibraryGrid.tsx`.
- Why good: converts the synchronous demo shell into a trackable owned-toy pipeline: multi-angle references, asynchronous fal queue, verified Webhook, atomic reservation/refund ledger, private signed media, burned Free watermark, cross-device owner identity, cloud Library, and SKU Campaign partial retry.
- Reuse / pitfalls:
  - No `FAL_KEY` means an honest cached Lab validation result, `chargedCredits: 0`, `persisted: false`; never push it into Library as a new model output.
  - Live jobs require the Supabase migration and private uploaded asset IDs. The service-role key stays server-only.
  - fal Webhooks use the official ED25519/JWKS verification contract and an atomic database claim. Late results cannot charge a timed-out/refunded reservation.
  - Stripe entitlements and event claims use Supabase in production. Local JSON remains development-only.
  - Annual billing stays hidden until both annual Price IDs exist. Production cannot be upgraded with a request-body `dev` flag.
  - Free live completion fails/refunds unless `FFMPEG_PATH` can burn the watermark; provider URLs are never exposed.
- Verified: TypeScript, clean ESLint, product-integrity tests, 80-page production build; desktop Studio and 390px browser pass; no-key task returned the same ID on idempotent replay and kept 30 credits before/after.
- External gate: run the SQL migration, then test real Supabase browser upload/CORS, fal output, ffmpeg result, and Stripe test lifecycle before changing these tasks from `review` to `done`.

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
  - Superseded by the T5 product foundation above: production entitlements now require Supabase; the JSON file is development-only.
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
- Why good: original no-DB validation scaffold; superseded for production by the T5 product foundation above.
- Reuse rules:
  - Deduct credits **before** fal call; **refund** on failure
  - Free plan → `watermark: true`; paid → false
  - Keep `CREDITS_PER_VIDEO = 10` unless pricing doc updates
  - Current rule: validation mode (no `FAL_KEY`) never deducts credits and must be labelled as cached PIKBO Lab media.

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
