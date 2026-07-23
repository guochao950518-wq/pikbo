# Mode A — Private preview launch (no public DNS)

**Goal:** Share a working soft-live site without pointing `pikbo.ai` yet.  
**Public Mode B** still needs G6 full Pass + boss domain approval.

## Already true on main (2026-07-24)

- Soft nav + honest labels
- Create / Seller Pack / Library / Explore
- CI green on main
- Supabase keys local; magic-link wired
- Stripe **off** (correct for soft launch)
- Health `softLive` when `FAL_KEY` + `SESSION_SECRET`

## Deploy private preview (Vercel)

```bash
cd /Users/x/claude/pikbo
# once: vercel login
npx vercel --yes
# set env in Vercel project (Production + Preview):
#   SESSION_SECRET
#   FAL_KEY
#   SUPABASE_URL
#   NEXT_PUBLIC_SUPABASE_URL
#   SUPABASE_ANON_KEY
#   NEXT_PUBLIC_SUPABASE_ANON_KEY
#   SUPABASE_SERVICE_ROLE_KEY
#   NEXT_PUBLIC_PAYMENTS_ENABLED=0
npx vercel --prod --yes   # or leave preview URL only
```

After deploy:

```bash
BASE_URL=https://YOUR.vercel.app npm run link-check
curl -s https://YOUR.vercel.app/api/health | jq .
```

## Supabase redirect for preview

Authentication → URL Configuration:

- Site URL: `https://YOUR.vercel.app`
- Redirect: `https://YOUR.vercel.app/auth/callback`
- Keep localhost entries for local dev

## SQL migration (durable wallets)

In Supabase SQL Editor, run:

`supabase/migrations/20260723120000_t5_auth_credits.sql`

## Do NOT do for Mode A

- Change `pikbo.ai` DNS
- Enable live Stripe
- Ads / public launch posts claiming production

## Mode B checklist (after G6)

See `docs/prd/GO_NO_GO.md`. Boss must explicitly approve public DNS.
