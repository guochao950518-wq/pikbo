# Feature map vs Higgsfield / Yiha-class suites

See also `docs/GAP_AUDIT.md` for the latest gap analysis.

## Legal
- ❌ Their logos, marketing stills, exact copy decks, CSS theft  
- ✅ Same **product modules** under Pikbo brand + original UI chrome  

## Module checklist

| Module | Big apps | Pikbo | Status |
|---|---|---|---|
| App shell nav | ✓ | `AppShell` | live |
| Home feed + demos | ✓ | `/` + GPT demos | live |
| Generate I2V | ✓ | `/create` · `/generate` | live Seedance |
| Duration / aspect / resolution | ✓ | CreateStudio | live |
| Generate T2V | ✓ | UI stub | partial |
| Models shelf | ✓ | `/models` | 2 live + slots |
| Apps library | ✓ | `/apps` | live + stubs |
| Cinema Studio | ✓ | `/cinema` | live → Generate |
| Viral presets | ✓ | `/effects` | live |
| Image studio | ✓ | `/image` + `/api/image` | live Flux (or demo) |
| Library manage | ✓ | filter + delete | live local |
| Community + real demos | ✓ | `/community` | live demos |
| Profile | ✓ | live credits | live guest |
| Settings | ✓ | `/settings` | live |
| Pricing annual toggle | ✓ | `/pricing` | UI live |
| Batch agent | ✓ | `/supercomputer` | live |
| Cmd+K palette | ✓ | global | live |
| Auth multi-device | ✓ | — | todo Supabase |
| Multi-model Kling/Veo live | ✓ | catalog only | later |

## Live engines
- Video: ByteDance **Seedance 2.0** + Fast (fal)
- Image: **Flux Schnell** (fal) · override `FAL_IMAGE_MODEL`
