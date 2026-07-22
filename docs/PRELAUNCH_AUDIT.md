# Pre-launch audit — find every problem before innovating

**Date:** 2026-07-22
**Gate rule:** bugs → diffs → honesty → residual risk → then innovate → then deploy.
**Build / lint:** green after this pass.

---

## 1. Closed this pass (real bugs / honesty)

| # | Severity | Issue | Fix |
|---|---|---|---|
| A1 | High | Lint 8× `set-state-in-effect` (React 19) — CI red | Deferred hydrate + `selectEffect` (no preset effect) |
| A2 | High | Pricing promised **720p free / 1080p paid**; engine is **480p free / 720p paid** | `lib/pricing.ts` perks + resolution types aligned |
| A3 | High | **Annual −20%** UI charged **monthly** Stripe | Annual CTA disabled + “monthly today” copy |
| A4 | Med | T2V tab looked live; API is **image-required only** | “soon” label + toast + generate blocks t2v |
| A5 | Med | No image size guard → huge base64 DoS risk | Client + `/api/generate` 12MB cap |
| A6 | Low | Unused `check` in image route; stale eslint-disable noise | Removed |
| A7 | Ops | Weak default `SESSION_SECRET` silent in prod | `console.error` if missing in production |
| A8 | Low | `isFree` used before declaration (readability) | Moved above `generate()` |

---

## 2. Residual risks (do not ship money/traffic without eyes open)

### Block launch of **paid Stripe** until

| ID | Risk | Why | Mitigation |
|---|---|---|---|
| R1 | **Entitlements on local JSON file** | Vercel serverless FS is ephemeral / multi-instance. Webhook may write a file that next request never sees. | Supabase/Redis/KV **before** real charges, or accept “guest cookie only + Stripe confirm on same browser” (fragile) |
| R2 | **Guest cookie = identity** | Clear cookies = new free account; no multi-device | Supabase auth P1 |
| R3 | **SESSION_SECRET** must be set | Forged sessions / credit theft if default secret leaks | Vercel env required (see LAUNCH.md) |
| R4 | **Watermark is player overlay** | Download is clean video for free tier | ffmpeg burn-in before marketing “watermarked” hard |
| R5 | **No rate limit** on generate/image | Credit helps, but guest rotation + fal cost burn | Edge rate limit / CAPTCHA later |
| R6 | **fal URLs are temporary** | Library stores remote URLs that may expire | Re-host or download-to-user blob later |

### OK for **demo / soft launch** (FAL_KEY + free only)

- I2V Seedance path live
- Credits deduct + refund on fail
- Free → Fast + 480p server-enforced
- Pricing cards honest
- Demo mode if no `FAL_KEY`

### Explicitly **not** claiming

- Multi-model Kling/Veo/Sora live
- Cloud library / auth
- Face-swap / lipsync / upscale (catalog stubs)
- Annual billing
- 1080p

---

## 3. Diffs vs suite competitors (honest scorecard)

| Area | HF / Yiha class | Pikbo | Verdict |
|---|---|---|---|
| Suite shell / nav / ⌘K | Strong | Strong | Parity enough |
| I2V core | Multi-model | Seedance 2.0/Fast | Niche win, not mall |
| T2V | Live | Roadmap | Honest soon |
| Library | Cloud | localStorage | Gap P1 |
| Auth | Required | Guest cookie | Gap P1 |
| Batch | Strong | Sequential Supercomputer | MVP OK |
| Image stills | Live | Flux live | OK |
| Cinema / apps depth | Deep | Brief + stubs | OK for vertical |
| Brand | Generic AI | Toy / blind-box voice | **Differentiate here** |

---

## 4. Product honesty checklist (ship criteria)

- [x] Free resolution matches server (480p)
- [x] Paid resolution matches server (720p)
- [x] Annual not sellable without yearly prices
- [x] T2V not sold as live
- [x] Stub apps labeled
- [ ] Watermark copy says “on-player” until ffmpeg (still soft)
- [ ] Production env: `SESSION_SECRET`, `FAL_KEY`
- [ ] Stripe only after R1 store is durable

---

## 5. Innovation backlog (only after gate)

Do these **after** residual R1–R4 are accepted or fixed — not instead of:

1. **Toy-native presets** that HF/Yiha won’t own (blind-box pull, shelf flex, Whatnot thrift)
2. **One-click sample stills** → effect chains already started — deepen
3. **Seller pack**: spin + unbox + listing crop as one batch template
4. **Community explore** of real user clips (needs auth + storage)
5. Brand polish: motion, empty states, “own toys only” trust

---

## 6. Recommended launch ladder

1. **Soft public** — domain + Vercel + `SESSION_SECRET` + `FAL_KEY`, free + demo paywall
2. **Charge** — only after durable entitlements (Supabase)
3. **Scale** — auth, rate limit, burn-in watermark, multi-model keys

Boss: deploy is still **your** button when product gate passes — agents do not push DNS/Vercel creds.
