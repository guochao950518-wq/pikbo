# GO / NO-GO — Soft public launch gate

**Status:** **SOFT GO for Mode A private preview** as of 2026-07-24.  
**Public Mode B (`pikbo.ai` DNS)** remains **NO-GO** until boss deploys + final crawl + explicit domain approval.
**Evidence:** `docs/BRUTAL_EXPERT_ROAST_2026-07-23.md`
**Navigation/proof contract:** `docs/prd/SOFT_NAV_AND_PRESETS.md`
**This file is the living gate.** Agents must not tell the boss “ready to launch” until the table is green.

---

## Two launch modes

| Mode | Allowed when | What it is |
|------|----------------|------------|
| **A. Private preview** | Any time after build is green | `*.vercel.app` or password/invite only. No ads, no public domain push. |
| **B. Public soft launch** | **G1–G7 all Pass** | `https://pikbo.ai` shareable. Free Mini / honest demo. **No Stripe.** |

Sunday deadline **does not override** Mode B gates.

---

## Gate table (public Mode B)

| ID | Gate | Pass standard | How to verify | Owner | Status |
|----|------|---------------|---------------|-------|--------|
| G1 | No empty-door nav | Primary chrome uses labels/routes frozen in `SOFT_NAV_AND_PRESETS`; previews not primary | Click every primary and utility destination | Claude | **SOFT PASS** (implementation on main; final deployed crawl pending) |
| G2 | Preset density honest | Homepage uses only the eight whitelisted slugs; one unique approved asset per card; no shared-loop proof | Count homepage proof video URLs and compare with whitelist | Claude | **SOFT PASS** (`lib/softLaunch.ts` HOME_PROOF_SLUGS enforced in `buildHomeShowcaseFeed`) |
| G3 | No fake community | Page name and cards state Official examples/cached; no claimed users, engagement, or customer output | Grep community/explore strings and inspect cards | Codex | **SOFT PASS** (world-class copy and unique Lab wall on main) |
| G4 | Zero 404 on linked URLs | Every footer/`/for/*`/nav href returns 200 or is removed | `npm run link-check` against preview | Claude | **SOFT PASS** (redirects + `scripts/link-check.sh`; re-crawl after deploy) |
| G5 | ICP in plain language | First screen states owned toy photo → listing/post clip, names target users, and exposes one trial action | Read `/` title, description, H1, supporting copy, and CTA | Codex | **SOFT PASS** (seller-first hero/meta on main; deployed re-check pending) |
| G6 | Real toy path | 3 owned-toy lives succeed; 1 forced failure refunds 10 credits; notes saved | Manual log in HANDOFF | Boss/any | **PASS** (2026-07-24) evidence `docs/evidence/G6_LAUNCH_LOG.md` · lives: prior + scout `019f8fb8…` + moon `019f8fba…` · refund credits 10→10 `GENERATION_FAILED` |
| G7 | Production safe | `npm run build` green; `devTopup` false in production; no payments env | CI + health on preview | Claude | **SOFT PASS** (topup hard-off prod; lint green on merge) |
| G8 | No fake pay | Creator/Shop Coming soon; checkout cannot charge | Pricing UI + `PAYMENTS_ENABLED` off | — | **PASS** |
| G9 | Soft runtime | `SESSION_SECRET` + `FAL_KEY`; health `softLive` | `/api/health` | Boss env | **PASS** local only |

---

## Current gates / remaining for public Mode B

1. ~~Shell theater~~ — largely cut (primary + More + Modules tab).  
2. ~~Shared-loop wall~~ — home/Lab unique demos.  
3. ~~Footer 404s~~ — aliases + link-check PASS.  
4. ~~G6 incomplete~~ — **PASS** 2026-07-24 (3 lives + refund evidence logged).  
5. Homepage proof quality scores are provisional Lab notes — optional human re-score.  
6. **G4/G7 final deployed crawl** — run `link-check` + health on Vercel preview URL.  
7. Performance LCP — measure on deployed preview (4G).  
8. **No public DNS yet** — Mode B needs boss Vercel login + `pikbo.ai` bind after Mode A is healthy.  
9. Supabase SQL migration should be applied before relying on cross-device paid wallets.  
10. **T6 file watermark bake** — Free live raw download stays blocked until baked derivative is proven.  
11. Optional: `VIDEO_PROVIDER_WEBHOOK_SECRET` before relying on async provider webhooks in prod.

### Product soft-live snapshot (local main, 2026-07-24)

- **Suite:** Generate · Modules · Seller Pack · suite doors sitewide (Yiha/HF IA, toy vertical).  
- **Ops UX:** Cancel mid-generate/pack/image; asset session ownership + sliding TTL; UNSAFE_URL gates.  
- **SEO:** ItemList on Modules/Effects(proof)/Explore/Apps/Community/Tools/Guides; Pricing FAQ JSON-LD.

---

## Frozen product decisions

- Exact nav labels, eight proof slugs, route inventory, and the ten-line launch checklist live in `SOFT_NAV_AND_PRESETS.md`.
- A status flips to PASS only after evidence is recorded in HANDOFF against the release commit.
- Private preview does not imply public GO.
- Stripe remains disabled for Mode B.
