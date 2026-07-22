# Pikbo — designer toy video maker (pikbo.ai)

Turn one photo of a figure / blind box / art toy into a shareable video.
Niche: **designer toys / collectibles**, English/global market, Google-SEO first.

## Stack
- **Next.js 16** (App Router) + **Tailwind v4**
- **fal.ai** image-to-video (`@fal-ai/client`) — the generation backend
- **Signed cookie session** — guest credits + plan (no DB required yet)
- **Stripe Checkout** (optional) — Creator / Shop subscriptions
- Programmatic SEO landing pages at `/effects/[slug]`, `/for/[slug]`, `/toys/[slug]`

## Run
```bash
cp .env.example .env.local
# optional: paste FAL_KEY, SESSION_SECRET, Stripe keys
npm run dev      # http://localhost:3000
```

| Mode | When | Behavior |
|---|---|---|
| **Demo** | no `FAL_KEY` | Returns a sample clip; still deducts credits |
| **Live gen** | `FAL_KEY` set | Real image-to-video via fal.ai |
| **Dev billing** | no Stripe keys, non-prod | `/api/checkout` upgrades plan instantly |
| **Live billing** | Stripe keys + price IDs | Redirects to Stripe Checkout |

## Credits & plans
| Plan | Price | Credits/mo | Watermark |
|---|---|---|---|
| Free | $0 | 30 (~3 clips) | yes |
| Creator | $19 | 500 (~50 clips) | no |
| Shop | $49 | 1,500 (~150 clips) | no |

Rule: **1 clip = 10 credits**. Failed generations refund credits.
Free tier always shows an on-player watermark; paid plans remove it.

## Where things live
| Path | What |
|---|---|
| `lib/presets.ts` | Effect presets — each is a studio effect **and** an SEO page |
| `lib/pricing.ts` | Plans + credit cost |
| `lib/session.ts` | Signed cookie guest session |
| `lib/credits.ts` | Check / deduct / refund |
| `app/api/generate` | Credits gate → fal.ai (or demo) |
| `app/api/me` | Current balance / plan |
| `app/api/checkout` | Stripe or dev upgrade |
| `app/pricing` | Pricing page + checkout buttons |
| `app/create` + `components/CreateStudio.tsx` | Upload → effect → generate |
| `app/sitemap.ts`, `app/robots.ts` | SEO plumbing |

## Deploy checklist
1. Host on Vercel (or any Node host) from this repo.
2. Env: `SESSION_SECRET`, `FAL_KEY`, Stripe keys (see `.env.example`).
3. Stripe webhook → `https://YOUR_DOMAIN/api/webhooks/stripe`  
   Events: `checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted`, `customer.subscription.updated`.
4. Create products/prices for Creator ($19) and Shop ($49); paste Price IDs into env.
5. Point domain (`pikbo.ai`) DNS to host.

## Roadmap
1. ~~Credits + free watermark + pricing checkout path~~ (done — cookie session)
2. ~~Stripe webhooks + checkout confirm~~ (done — file entitlements)
3. **Auth + credits DB** (Supabase) — multi-device balance, history
4. **Server-side video watermark** (ffmpeg) for free downloads
5. **Real demo clips** on homepage (need fal renders)
6. Vertical ads / affiliate (after free traffic is stable)

## Multi-agent workflow (Grok · GPT · Claude)
Single source of truth: **this GitHub repo**.

| Doc | Purpose |
|---|---|
| [`docs/BOSS.md`](./docs/BOSS.md) | **老板怎么只说一遍就指挥三个人** |
| [`docs/DISPATCH.md`](./docs/DISPATCH.md) | **当前总指令**（老板改这一份） |
| [`COLLAB.md`](./COLLAB.md) | Branch rules, how to pull each other’s good commits |
| [`docs/STATUS.md`](./docs/STATUS.md) | Live task board — **claim before coding** |
| [`docs/HANDOFF.md`](./docs/HANDOFF.md) | Quality landings worth reusing |
| [`AGENTS.md`](./AGENTS.md) | Short entrypoint for any agent session |
| [`tools/README_TELEGRAM.md`](./tools/README_TELEGRAM.md) | 手机 Telegram 派活 |

```bash
git fetch origin --prune && git pull --ff-only
# claim a row in docs/STATUS.md, then:
git checkout -b agent/<grok|gpt|claude>/<topic>
```

## Guardrails
- Users animate **their own photos** of toys they own — no brand-name generation.
- Never offer true "unlimited" on expensive models. Cost control = survival.
