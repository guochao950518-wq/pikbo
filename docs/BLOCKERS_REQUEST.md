# Blockers request — one consolidated ask for the boss

**Owner:** Grok (final takeover)  
**Updated:** 2026-07-23  
**Rule:** Keep doing no-cost work; ask once with this list when external input is required.

## Already unblocked in code (no boss action)

| Item | Status |
|---|---|
| Wave A core video loop | On `main` |
| Wave B generation trust (B1–B5) | On `main` |
| CI workflow *template* | `docs/ci/github-actions-ci.yml` |
| T5 SQL migration | `supabase/migrations/20260723120000_t5_auth_credits.sql` |
| T5 pure reserve/settle/release engine + local file adapter | `lib/durableCredits/*` |
| Session source-image interning (no 8× Base64) | CreateStudio + createTrust |

## Needs boss (secrets / spend / login / DNS)

### 1. GitHub Actions workflow install

- **Why:** OAuth token used by agents lacks `workflow` scope; cannot write `.github/workflows/ci.yml`.
- **Ask:** Copy `docs/ci/github-actions-ci.yml` → `.github/workflows/ci.yml` with a token that has `workflow` scope, or paste in GitHub UI.
- **Done when:** One green Actions run URL on `main`.

### 2. Supabase project (T5 durable auth/credits)

- **Why:** Production must not use Cookie/file as source of truth for paid.
- **Ask:** Create Supabase project; provide (to env only, not chat if possible):
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- **Then Grok:** Apply migration, wire Auth (magic link + Google), guest→account migration.
- **Spend:** Free Supabase tier is enough for private beta.

### 3. G6 live Mini proof (2 more owned-toy jobs + refund)

- **Why:** Public GO_NO_GO still needs 3 live + 1 post-debit refund evidence (1 live already logged).
- **Ask:** Confirm `FAL_KEY` on a machine that may spend, and budget ceiling.
- **Estimate:** ~2–3 Mini jobs × ~$0.35–1 each + one forced-fail refund path (no fal burn if `PIKBO_FORCE_GENERATE_FAIL=1`).
- **Stop:** After 2 live OK + 1 refund proof, or $5 spend — whichever first.

### 4. Optional later (do not block Phase C–E coding)

| Item | Need |
|---|---|
| Stripe **test** keys | After durable auth; still no live charge |
| Vercel private preview login | Private RC only |
| Public DNS `pikbo.ai` | Separate explicit approval after GO green |
| ffmpeg / media worker for T6 bake | Or approved media service |

## Explicitly NOT requested

- Live Stripe charges  
- Public DNS cutover  
- Unlimited generation  
- Copying Higgsfield content  

## Next code work without these secrets

1. Wire generate route optional path: when `DURABLE_CREDITS=local`, reserve→settle/release around existing debit (shadow mode + tests).  
2. Auth UI shells (magic link form) gated off until Supabase env present.  
3. Async job API stubs (`/api/generations`) behind feature flag.  
4. Free download remains blocked until T6 file bake exists.
