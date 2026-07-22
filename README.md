# PIKBO — owned-toy photo to commercial video

PIKBO turns photos of figures, blind boxes, art toys, and plush toys the user
owns into marketplace clips, launch hooks, and collector reels. It is a vertical
toy-content product, not a general-purpose AI video clone.

## Product state

The repository currently ships a private validation product:

- Immersive toy-video homepage with six cached PIKBO Lab clips.
- Studio flow: owned-toy references → purpose/effect → quote → async task → result.
- SKU Campaign flow with multiple presets/ratios, two-worker queue, partial retry,
  and CSV manifest export.
- Async fal queue/Webhook architecture, private Supabase assets, idempotent credit
  reservations/refunds, and signed output delivery.
- Supabase email account adapter and durable cross-device owner IDs.
- Stripe Checkout, subscription Webhooks, annual-price gating, and Customer Portal.
- Free live outputs must pass through server-side ffmpeg watermarking.

Without external credentials the product stays in **validation mode**: it returns
a clearly labelled cached Lab clip, makes no model request, charges zero credits,
and never writes the clip to the user Library as a new generation.

## Stack

- Next.js 16 App Router, React 19, Tailwind v4.
- ByteDance Seedance through `@fal-ai/client`.
- Supabase Auth, Postgres, and private Storage through server-side REST/RPC calls.
- Stripe Checkout, Webhooks, and Customer Portal.
- ffmpeg worker for free-tier output watermarking.
- Programmatic SEO at `/effects/[slug]`, `/for/[slug]`, `/toys/[slug]`, and `/guides/[slug]`.

## Local validation

```bash
cp .env.example .env.local
npm install
npm run dev
```

Set a long random `SESSION_SECRET`. The remaining credentials are optional for
UI validation.

| Mode | Required configuration | Behavior |
|---|---|---|
| Validation | `SESSION_SECRET` only | Cached PIKBO Lab output, zero charge, ephemeral tasks |
| Cloud account/data | Supabase URL + anon/service keys + migration | Login, private assets, projects, durable jobs and credits |
| Live generation | Cloud data + `FAL_KEY` + HTTPS Webhook URL | Async Seedance queue and signed results |
| Free live export | Live generation + `FFMPEG_PATH` | Watermark burned into the downloadable file |
| Test billing | Cloud data + Stripe test keys/prices/Webhook | Subscription lifecycle and durable entitlements |

Run the production gates:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Production data and API

Run [`supabase/migrations/202607220001_product_foundation.sql`](./supabase/migrations/202607220001_product_foundation.sql)
before enabling live jobs or billing. The migration creates private projects,
assets, async jobs, credit accounts/ledger, subscription entitlements, and
atomic Webhook claims.

Primary endpoints:

| Endpoint | Purpose |
|---|---|
| `POST /api/auth/email` | Supabase email signup/sign-in |
| `POST /api/assets/upload-url` | Private signed toy-reference upload |
| `GET/POST /api/projects` | Cloud project folders |
| `GET/POST /api/generations` | List/create asynchronous jobs |
| `GET /api/generations/[id]` | Poll status and obtain a short-lived output URL |
| `POST /api/generations/[id]/retry` | Create a new metered retry job |
| `POST /api/webhooks/fal` | Verified, atomically idempotent fal completion |
| `POST /api/webhooks/stripe` | Verified, atomically idempotent subscription lifecycle |
| `POST /api/billing/portal` | Stripe Customer Portal |

`/api/generate` remains a compatibility endpoint while the Studio migration is
completed. New product work must use `/api/generations`.

## Credits and output safety

| Plan | Price | Credits/month | Download |
|---|---:|---:|---|
| Free | $0 | 30 | Watermarked, fast model |
| Creator | $19 | 500 | No watermark |
| Shop | $49 | 1,500 | No watermark, SKU Campaign |

One short clip currently reserves 10 credits. The database transaction prevents
concurrent overspend. Provider submission failure, processing failure, and task
timeout settle the same reservation exactly once. The fal public URL is never
returned to the browser; PIKBO copies output into private Storage first.

## Release gate

Do not connect `pikbo.ai` or enable live Stripe until all of these pass:

1. Supabase migration and email login tested across two browsers.
2. Real fal queue + signed Webhook + timeout/refund paths tested with a capped budget.
3. Free result downloaded from Storage and visually verified to contain a burned watermark.
4. Stripe test subscription, renewal, upgrade/downgrade, cancellation, payment failure,
   duplicate event, and Customer Portal tested.
5. At least 12 model-verified toy cases replace prototype-only evidence.
6. Private preview runs for 72 hours without credit drift or a priority defect.

## Collaboration

Read [`COLLAB.md`](./COLLAB.md), claim work in [`docs/STATUS.md`](./docs/STATUS.md),
and record reusable work in [`docs/HANDOFF.md`](./docs/HANDOFF.md). Never force-push
`main`, and stage only files owned by the current task.

## Guardrails

- Users may upload only toy photos and character artwork they own or are authorized to use.
- Cached Lab media must never be labelled as a newly generated user result.
- Do not copy competitor trademarks, text, media, user work, or private code.
- Never offer “unlimited” expensive generation or expose provider output URLs.
