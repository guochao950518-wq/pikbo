# G6 live proof harness (no auto spend)

Public GO needs: **3 owned-toy live Mini successes** + **1 post-debit refund**.

## Already logged

- 1× live Mini OK (see HANDOFF G6 notes).

## Prep (no FAL burn)

```bash
# 1) Health
curl -s http://localhost:3000/api/health | jq '.ready,.fal,.sessionSecret'

# 2) Refund path without fal (dev only)
PIKBO_FORCE_GENERATE_FAIL=1 npm run dev
# other terminal:
G6_TEST_REFUND=1 npm run g6-api-smoke
```

## Live Mini (requires boss budget + FAL_KEY)

Stop after **2 more** successes or **$5** spend.

```bash
# With FAL_KEY + SESSION_SECRET in .env.local
npm run dev
# Then POST /api/generate with ownsRights:true + owned toy still (scout/orbit/moon)
# Or: npm run g6-api-smoke  (when script supports live mode)
```

## Cost estimate request (for BLOCKERS)

| Item | Count | Model | Est. |
|---|---|---|---|
| Live Mini owned-toy | 2 | Seedance Mini 5s 480p | ~$0.5–2 total |
| Forced fail refund | 1 | no fal | $0 |
| Cap | — | — | **$5 max then stop** |

## Stop conditions

1. 2 live OK recorded in HANDOFF with requestId  
2. 1 refund with `creditsRefunded:true`  
3. Or $5 spent  
