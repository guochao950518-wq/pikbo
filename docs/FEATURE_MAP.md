# Feature map vs Higgsfield / Yiha-class suites

See also `docs/GAP_AUDIT.md` for the latest gap analysis.

## Legal
- ❌ Their logos, marketing stills, exact copy decks, CSS theft  
- ✅ Same **product modules** under Pikbo brand + original UI chrome  

## Module checklist

| Module | Big apps | Pikbo | Status |
|---|---|---|---|
| App shell nav | ✓ | `AppShell` | live |
| Home feed + demos | ✓ | `/` + GPT demos | cached, labeled |
| Generate I2V | ✓ | `/create` · `/generate` | provider-configured; cached fallback |
| Duration / aspect / resolution | ✓ | CreateStudio | live |
| Generate T2V | ✓ | UI stub | partial |
| Models shelf | ✓ | `/models` | catalog; capabilities labeled |
| Apps library | ✓ | `/apps` | configured workspaces + stubs |
| Cinema Studio | ✓ | `/cinema` | configured workspace → Generate |
| Viral presets | ✓ | `/effects` | recipes + cached previews |
| Image studio | ✓ | `/image` + `/api/image` | configured Flux or labeled demo |
| Library manage | ✓ | filter + delete | live local |
| PIKBO Lab + cached demos | ✓ | `/community` | cached and concept-labeled |
| Profile | ✓ | browser-session credits | guest prototype |
| Settings | ✓ | `/settings` | UI prototype |
| Pricing annual toggle | ✓ | `/pricing` | UI; billing gated |
| Batch agent | ✓ | `/supercomputer` | workspace; provider-gated |
| Cmd+K palette | ✓ | global | live |
| Auth multi-device | ✓ | — | todo Supabase |
| Multi-model Kling/Veo live | ✓ | catalog only | later (honest only) |
| Flow creation hub | ✓ | `/flow` | live |
| Remix deep links | ✓ | `/create?effect&source…` | live |
| Official project detail | ✓ | `/projects/[slug]` | live |
| SEO tool landings | ✓ | `/tools/*` | live |
| First-run sample try | ✓ | `/create?try=1` | live |

**Legal:** `docs/LEGAL_PARITY_PLAN.md` — pattern parity only, no brand/media theft.

## Provider-backed engines
- Video: ByteDance **Seedance 2.0** + Fast (fal)
- Image: **Flux Schnell** (fal) · override `FAL_IMAGE_MODEL`
