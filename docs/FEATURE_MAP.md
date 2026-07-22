# Feature map vs Higgsfield / Yiha-class suites

Boss asked: same look/feel + every feature surface those sites expose.

## Legal
- ❌ Their logos, marketing stills, exact copy decks, CSS theft  
- ✅ Same **product modules** under Pikbo brand + original UI chrome  

## Module checklist

| Module | Big apps | Pikbo route | Status |
|---|---|---|---|
| App shell nav | ✓ | `AppShell` | live |
| Home feed | ✓ | `/` | live |
| Generate I2V | ✓ | `/create` | live (Seedance) |
| Generate T2V | ✓ | `/create?mode=t2v` | UI only |
| Models shelf | ✓ | `/models` | live catalog |
| Apps library | ✓ | `/apps` | live + stubs |
| Cinema Studio | ✓ | `/cinema` | live → Generate |
| Viral presets | ✓ | `/effects` | live |
| Image studio | ✓ | `/image` | UI shell |
| Library | ✓ | `/library` | local history |
| Community | ✓ | `/community` | mock wall |
| Profile | ✓ | `/profile` | guest |
| Pricing / credits | ✓ | `/pricing` | live |
| Supercomputer / agents | ✓ | `/supercomputer` | shell |
| Face swap / lipsync / upscale | ✓ | `/apps/*` | stub |
| Multi-model (Kling/Veo/Sora) | ✓ | catalog cards | soon slots |
| Auth | ✓ | — | todo Supabase |
| Real image models | ✓ | — | wire fal image next |

## Live generate engines
- ByteDance **Seedance 2.0** + **Fast** via fal (`lib/models.ts`)
