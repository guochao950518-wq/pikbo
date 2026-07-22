# Pikbo vs Higgsfield / Yiha — capability audit (2026-07-22)

## Scorecard (product feel, not pixel clone)

| Area | Big apps | Pikbo now | Gap | Priority |
|---|---|---|---|---|
| App shell + nav | Strong | Strong | — | done |
| Home demos | Strong | Strong (GPT demos) | — | done |
| Generate I2V | Strong | Strong (Seedance) | polish | done |
| Duration / aspect | Strong | Strong | — | done |
| Resolution control | Strong | Free/paid only | **UI missing** | **P0** |
| Models shelf | Multi live | 2 live + placeholders | OK for niche | P2 |
| Apps catalog | Deep | Live+stubs | OK | P2 |
| Cinema | Full studio | Brief→Generate | OK MVP | P2 |
| Library | Cloud multi-device | Local only | auth later | P1 |
| Library manage | delete/filter | weak | **P0** | **P0** |
| Image gen | Live | Shell only | **wire fal** | **P0** |
| Batch agent | Strong | Live sequential | OK | done |
| Pricing annual toggle | Strong | Monthly only | **P0** | **P0** |
| Auth | Required | Guest cookie | P1 (planned) | P1 |
| Command palette | Often | Missing | **P0** | **P0** |
| Settings / clear data | Often | Missing | **P0** | **P0** |
| /generate alias | Common | only /create | **P0** | **P0** |
| Explore with real media | Strong | Mock + demos home | strengthen community | P1 |
| Deploy | Live domains | Boss paused | blocked | — |

## This sprint closes (P0)
1. Resolution selector (480p/720p; free locked 480p)
2. Image generate API + live Image studio
3. Library filter + delete item
4. Cmd+K command palette
5. Settings page (clear library/favorites/onboarding)
6. Pricing monthly/annual UI toggle
7. `/generate` → create
8. Community uses demo media when available

## Won't fake
- Real multi-model Kling/Veo/Sora without keys
- Cloud auth without Supabase
- Their brand assets
