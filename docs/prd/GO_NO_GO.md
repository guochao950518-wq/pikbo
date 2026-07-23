# GO / NO-GO — Soft public launch gate

**Status:** **NO-GO** for public `pikbo.ai` as of 2026-07-23.
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
| G1 | No empty-door nav | Primary chrome uses the five labels/routes frozen in `SOFT_NAV_AND_PRESETS`; previews are not primary destinations | Click every primary and utility destination | Claude | **SOFT PASS** (implementation on main; final deployed crawl pending) |
| G2 | Preset density honest | Homepage uses only the eight whitelisted slugs; one unique approved asset per card; no shared-loop proof | Count homepage proof video URLs and compare with whitelist | Claude | **SOFT PASS** (home ≤8 unique; final provenance review remains) |
| G3 | No fake community | Page name and cards state Official examples/cached; no claimed users, engagement, or customer output | Grep community/explore strings and inspect cards | Codex | **SOFT PASS** (world-class copy and unique Lab wall on main) |
| G4 | Zero 404 on linked URLs | Every footer/`/for/*`/nav href returns 200 or is removed | `npm run link-check` against preview | Claude | **SOFT PASS** (redirects + `scripts/link-check.sh`; re-crawl after deploy) |
| G5 | ICP in plain language | First screen states owned toy photo → listing/post clip, names target users, and exposes one trial action | Read `/` title, description, H1, supporting copy, and CTA | Codex | **SOFT PASS** (seller-first hero/meta on main; deployed re-check pending) |
| G6 | Real toy path | 3 owned-toy lives succeed; 1 forced failure refunds 10 credits; notes saved | Manual log in HANDOFF | Boss/any | **PARTIAL** (1 live Mini ok 2026-07-23; need 2 more + refund log) |
| G7 | Production safe | `npm run build` green; `devTopup` false in production; no payments env | CI + health on preview | Claude | **SOFT PASS** (topup hard-off prod; lint green on merge) |
| G8 | No fake pay | Creator/Shop Coming soon; checkout cannot charge | Pricing UI + `PAYMENTS_ENABLED` off | — | **PASS** |
| G9 | Soft runtime | `SESSION_SECRET` + `FAL_KEY`; health `softLive` | `/api/health` | Boss env | **PASS** local only |

---

## Current NO-GO reasons

1. ~~Shell theater~~ — largely cut (primary + More).  
2. ~~Shared-loop wall~~ — home/Lab unique demos.  
3. ~~Footer 404s~~ — aliases + link-check PASS.  
4. **G6 incomplete** — need two more owned-toy live jobs and one proven refund.
5. Homepage proof assets still need a recorded provenance/quality review.
6. G4/G7 require a final deployed crawl, health check, and production build on the release commit.
7. Performance LCP remains a quality risk and must be measured on the deployed preview.
8. **No public deploy yet** — Mode B needs boss-controlled hosting/domain work after every gate passes.

---

## Frozen product decisions

- Exact nav labels, eight proof slugs, route inventory, and the ten-line launch checklist live in `SOFT_NAV_AND_PRESETS.md`.
- A status flips to PASS only after evidence is recorded in HANDOFF against the release commit.
- Private preview does not imply public GO.
- Stripe remains disabled for Mode B.
