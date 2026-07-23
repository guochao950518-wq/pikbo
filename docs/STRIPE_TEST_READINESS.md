# Stripe test readiness (Phase I) — not live charges

**Status:** Preparation only. Live keys and public payment stay off until boss approval.

## Already in repo

- Checkout + webhook routes under `app/api/checkout` and `app/api/webhooks/stripe`
- Entitlements file store (`lib/entitlements.ts`) for soft-launch
- Feature flag pattern: payments disabled without keys / `NEXT_PUBLIC_PAYMENTS_ENABLED`
- **`paymentsReadiness()`** on `/api/health` → `payments` (test vs live secret mode, never echoes keys)
- Checkout refuses when flag off (`PAYMENTS_DISABLED`) or `sk_live` without `PAYMENTS_LIVE=1`

## Before enabling test mode

1. Durable auth/credits (T5) green with Supabase — Cookie is not enough for paid.
2. Stripe **test** secret + webhook secret + Price IDs for Creator/Shop.
3. Idempotent `stripe_events` table (SQL migration already drafted).
4. Free watermark file bake (T6) so free users cannot raw-download.
5. Concurrency tests: double webhook, double checkout confirm.

## Explicitly forbidden until separate approval

- Live secret keys
- Public payment buttons on pikbo.ai
- Yearly prices without a real Price ID

## Boss checklist (when ready)

- [ ] `STRIPE_SECRET_KEY` (test)
- [ ] `STRIPE_WEBHOOK_SECRET` (test)
- [ ] `STRIPE_PRICE_CREATOR` / `STRIPE_PRICE_SHOP` (test)
- [ ] Confirm `NEXT_PUBLIC_PAYMENTS_ENABLED=1` only on private preview
