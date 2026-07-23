# GO / NO-GO — Soft public launch gate

**Status:** **NO-GO** for public `pikbo.ai` as of 2026-07-23 (Grok ruling; pending GPT formalization).  
**Evidence:** `docs/BRUTAL_EXPERT_ROAST_2026-07-23.md`  
**Owner to formalize Pass criteria:** GPT (`agent/gpt/go-no-go-soft`)  
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
| G1 | No empty-door nav | Primary chrome ≤6 real destinations; no “Models Soon” in main bar; Cinema/Batch/Feed not dressed as full products | Click every primary nav item: each is a finished soft job or clearly Preview | Claude + GPT list | **FAIL** |
| G2 | Preset density honest | ≤8 homepage hero presets; one unique demo asset per hero preset; no “shared loop” wall as main proof | Count homepage video `src`; no asset >2 uses in hero band | Claude | **FAIL** |
| G3 | No fake community | Lab copy = Official demos / samples; no “users are posting” without real UGC | Grep community/explore strings | Codex | **FAIL** |
| G4 | Zero 404 on linked URLs | Every footer/`/for/*`/nav href returns 200 or is removed | Script curl all internal links from home+pricing+create | Claude | **FAIL** (`/for/etsy-sellers` 404) |
| G5 | ICP in plain language | First screen: who + job + free trial; no “when live generation is enabled” in meta/hero | Read `/` title, meta, hero | Codex | **FAIL** |
| G6 | Real toy path | 3 owned-toy lives succeed; 1 forced failure refunds 10 credits; notes saved | Manual log in HANDOFF | Boss/any | **FAIL** (not run) |
| G7 | Production safe | `npm run build` green; `devTopup` false in production; no payments env | CI + health on preview | Claude | **WARN** |
| G8 | No fake pay | Creator/Shop Coming soon; checkout cannot charge | Pricing UI + `PAYMENTS_ENABLED` off | — | **PASS** |
| G9 | Soft runtime | `SESSION_SECRET` + `FAL_KEY`; health `softLive` | `/api/health` | Boss env | **PASS** local only |

---

## Explicit NO-GO reasons (current)

1. Suite **shell theater** (nav count > product depth).  
2. **Shared demo loops** inflate presets.  
3. **Broken SEO/footer links** (404).  
4. **Unproven** live hand test + refund.  
5. Performance LCP poor (secondary; does not alone block if A/B modes respected, but must not ignore on public).

---

## GPT must expand

- Exact nav whitelist + labels.  
- Exact 8 preset slugs.  
- Link inventory table.  
- 10-line boss checklist for Mode B day-of.  

See `docs/DISPATCH.md` GPT block. After GPT push, replace “pending” sections and flip Status column only with evidence.
