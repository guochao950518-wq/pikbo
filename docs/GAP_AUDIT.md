# Pikbo vs Higgsfield / Yiha — capability audit (2026-07-22)

> Full pre-launch findings: **[PRELAUNCH_AUDIT.md](./PRELAUNCH_AUDIT.md)**

## Scorecard (product feel, not pixel clone)

| Area | Big apps | Pikbo now | Gap | Priority |
|---|---|---|---|---|
| App shell + nav | Strong | Strong | — | done |
| Home demos | Strong | Strong (GPT demos) | — | done |
| Generate I2V | Strong | Strong (Seedance) | polish | done |
| Duration / aspect | Strong | Strong | — | done |
| Resolution control | Strong | UI + server tier lock | honest 480/720 | done |
| Models shelf | Multi live | 2 live + placeholders | OK for niche | P2 |
| Apps catalog | Deep | Live+stubs | OK | P2 |
| Cinema | Full studio | Brief→Generate | OK MVP | P2 |
| Library | Cloud multi-device | Local only | auth later | P1 |
| Library manage | delete/filter | live | — | done |
| Image gen | Live | Flux live | — | done |
| Batch agent | Strong | Live sequential | OK | done |
| Pricing annual | Real yearly Stripe | **Preview only** (honest) | yearly prices | P1 |
| Pricing copy vs engine | — | Aligned 480/720 | — | done |
| Auth | Required | Guest cookie | planned | P1 |
| Command palette | Often | Cmd+K | — | done |
| Settings / clear data | Often | live | — | done |
| /generate alias | Common | → create | — | done |
| T2V | Live | Roadmap (labeled soon) | later | P2 |
| Explore | Strong | Feed + demos | user UGC later | P1 |
| Deploy | Live domains | Boss paused | blocked | — |

## Closed (P0 + honesty pass)
1. Resolution selector (480p/720p; free locked 480p) ✅
2. Image generate API + live Image studio ✅
3. Library filter + delete item ✅
4. Cmd+K command palette ✅
5. Settings page ✅
6. Pricing monthly + **honest annual preview** ✅
7. `/generate` → create ✅
8. Community demo media ✅
9. Sample toy stills one-click ✅
10. Batch duration/aspect ✅
11. Image history + health endpoint ✅
12. Seed control, Share X, toasts, StatusBadge ✅
13. Explore feed page ✅
14. Lint green (set-state-in-effect cluster) ✅
15. Pricing perks match Seedance caps ✅
16. Image payload size guard ✅
17. T2V not sold as live ✅

## Still open (honest)
- Supabase auth / durable entitlements (Vercel FS ephemeral — **block real Stripe**)
- Kling/Veo/Sora live keys
- ffmpeg watermark burn-in (overlay is temporary)
- Annual Stripe price IDs
- Deploy (boss paused)

## Won't fake
- Real multi-model Kling/Veo/Sora without keys
- Cloud auth without Supabase
- Their brand assets
- 1080p / annual billing until wired
