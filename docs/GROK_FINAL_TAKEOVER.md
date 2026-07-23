# Grok final takeover — complete the remaining Pikbo product

**Authority:** Boss, 2026-07-23

**Owner:** Grok

**Status:** Assigned

**Canonical branch:** `agent/grok/final-takeover`

**Commit prefix:** `[grok]`

**Supersedes:** unfinished Claude/GPT implementation lanes until the boss changes this instruction

## 0. Mission

Take Pikbo from the current convincing private demo to a reliable private paid-beta
candidate. Complete every remaining code, QA, documentation and release-readiness
task that does not require the boss to reveal a secret, approve model spend, complete
an external login, or authorize public DNS/payment activation.

Do not wait for Claude or GPT. Do not create more planning-only work. Read the
existing contracts, implement them, verify them, and land small reviewable commits.

When one item is externally blocked:

1. record the exact blocker and evidence in `docs/BLOCKERS_REQUEST.md`;
2. continue immediately with the next unblocked item;
3. ask the boss once, with one consolidated request, only after all no-cost work is
   complete.

## 1. Start exactly here

```bash
git fetch origin --prune
git checkout main
git pull --ff-only origin main
git checkout -b agent/grok/final-takeover
```

Read before editing:

- `docs/ROLES.md`
- `docs/DISPATCH.md`
- `docs/STATUS.md`
- `docs/HANDOFF.md`
- `docs/prd/GO_NO_GO.md`
- `docs/prd/WORLD_CLASS_PIKBO.md`
- `docs/prd/HIGGSFIELD_PUBLIC_PARITY.md`
- `docs/prd/SELLER_PACK.md`
- `docs/prd/AUTH_CREDITS.md`
- `docs/prd/SOFT_LAUNCH.md`
- `docs/api/GENERATE.md`
- `docs/business/CREDITS_AND_PLANS.md`
- `docs/UNIT_ECONOMICS.md`

Before reusing an old agent branch, inspect its diff against `main`. Cherry-pick only
finished, compatible work. Never merge a whole stale branch over newer Wave A code.

## 2. Verified baseline

Latest reviewed baseline: `main` at `8804d70`.

Working now:

- Home with eight distinct official cached examples.
- Explore with 12 traceable projects and category filtering.
- `/projects/[slug]` input/output, recipe and metadata surface.
- Create upload, recipes, controls, cached/live labels and session version stack.
- Device-local Library.
- Seller Pack entry at `/create?mode=seller-pack`.
- Production build generates 126 routes.
- Engine smoke, ESLint and TypeScript pass.
- Link check passes 50 tested routes and unknown projects return 404.

Not complete:

- Only one of three required owned-toy live generations is recorded.
- Post-debit failure/refund proof is incomplete.
- Current environment has no production `FAL_KEY` or `SESSION_SECRET`.
- Account, balance and entitlements are Cookie/file based.
- Free output watermark is a player overlay, not a protected deliverable.
- No current `.github/workflows/ci.yml` exists on `main`.
- Demo-mode critical path exits nonzero because health is degraded without secrets.
- Payment, public domain and production release remain disabled.

## 3. Frozen product truth

- Product: a user-owned toy photo becomes a listing or social video.
- Primary users: collectors, Etsy sellers, Whatnot sellers and toy shops.
- Cached Lab examples cost 0 credits and do not process the upload.
- Current live contract is 10 credits per child until weighted metering is proven.
- Free is approximately one Mini 5s 480p live result.
- Creator is approximately five current live results.
- Shop is approximately fifteen current live results.
- No unlimited generation claim.
- No fake UGC, fake likes, fake customers, fake live output or duplicated media
  presented as different proof.
- Stripe, public DNS and production charging remain off until their gates pass.

## 4. Execution order

Do these phases in order. A later phase may start only when the earlier phase is
implemented or documented as externally blocked.

### Phase A — Wave B trust defects

#### A1. Separate attempt settlement from selected version

- Keep `lastAttemptSettlement` independent from the active successful version.
- Allowed outcomes: `none`, `cached`, `used`, `restored`, `unconfirmed`.
- Existing success followed by network/provider ambiguity must still show
  `refund unconfirmed`.
- Confirmed post-debit failure shows `10 restored`.
- Selecting an older success must not erase the latest attempt outcome.
- Never claim a refund based only on a client guess.

#### A2. Make Retry and Make variant different

- Store an immutable generation specification per version:
  input asset reference, effect, aspect, duration, resolution, model, seed when
  present, request ID and provider.
- `Retry` reuses the selected version specification and appends a new version.
- `Make variant` uses the current Composer settings and appends a new version.
- Never overwrite an older successful result.
- Seller Pack retry targets only the failed child.

#### A3. Server-authoritative result metadata

- Extend the Generate response with the validated effect/recipe, actual model,
  duration, aspect, resolution, charged credits, settlement outcome, provider and
  request ID.
- Frontend labels a value “server returned” only when it came from that response.
- Preserve existing provider selection and debit/refund behavior while adding the
  contract.

#### A4. Accessibility and memory

- Remove focusable media nested inside project links. One card gets one clear
  keyboard target.
- Preserve desktop hover/focus playback and mobile single-video playback.
- Do not retain eight independent large Base64 copies of the same source image.
- Use a shared session reference or object URL and revoke object URLs correctly.

Regression tests required:

1. old success → ambiguous failure → `refund unconfirmed`;
2. old success → confirmed failure → `10 restored`;
3. Retry reuses the old specification;
4. Variant uses current Composer controls;
5. one Seller Pack failure preserves successful siblings.

### Phase B — CI and deterministic validation

Add `.github/workflows/ci.yml` for pull requests and pushes to `main`.

Required jobs:

- conflict-marker check;
- engine-smoke;
- ESLint;
- TypeScript;
- production build;
- route/link test using a started production server;
- critical-path test.

Split health acceptance into two explicit modes:

- `demo-cached`: no `FAL_KEY`; cached demo must work and cost 0;
- `soft-live`: requires `SESSION_SECRET` and `FAL_KEY`.

The default no-secret CI must pass demo mode. A separate environment-aware check may
correctly fail soft-live readiness. Do not make a usable cached demo report as a
broken application.

Replace remote Google Font build dependency with self-hosted/local fonts or a
network-independent fallback. Fix the Turbopack whole-project trace caused by
filesystem entitlement imports. Record a real green GitHub Actions run URL.

### Phase C — T5 durable identity and credits

Implement `docs/prd/AUTH_CREDITS.md`, using Supabase Auth + Postgres when configured.

Required:

- SQL migrations for profiles, accounts, memberships, wallets, reservations,
  append-only ledger, generation jobs, subscriptions and Stripe event IDs;
- RLS policies and server-only privileged access;
- email OTP/magic link and Google OAuth UI, environment gated;
- one-time guest Cookie → durable Free-account migration, capped and idempotent;
- transactional reserve, settle and release;
- concurrent requests cannot overspend;
- Seller Pack reserves 30 and settles/releases 10 per child;
- cross-device balance and history use the durable user account;
- production refuses unsafe Cookie/file entitlement authority.

Development may retain an explicit local adapter. Production must fail closed when a
durable backend is required but unavailable. Do not silently fall back to JSON files.

Do not enable live Stripe in this phase.

### Phase D — asynchronous generation and asset storage

Build the durable path specified by the existing PRDs:

- `POST /api/assets/upload-url`
- `POST /api/generations`
- `GET /api/generations/[id]`
- `POST /api/generations/[id]/retry`
- `POST /api/webhooks/video-provider`

Keep `/api/generate` temporarily as a compatibility adapter.

Required behavior:

- signed/direct asset upload instead of repeatedly posting large Base64 payloads;
- persistent `queued`, `running`, `succeeded`, `failed`, `canceled` states;
- request and webhook idempotency;
- reservation before provider submit;
- settlement on success;
- release/refund only on confirmed failure;
- timeout recovery and bounded retry;
- refresh and cross-device recovery;
- provider raw URL never becomes permanent customer storage;
- no duplicate jobs from webhook retries.

### Phase E — T6 protected free deliverables

Free live results must not expose a downloadable raw provider URL.

Implement:

- source/original stored privately;
- server-produced Pikbo-watermarked derivative;
- free users receive only the derivative;
- paid authorization may receive a short-lived signed original URL;
- poster and web playback renditions stored separately;
- controlled download endpoint checks account and plan;
- source URLs and storage paths are not exposed in client history.

If the selected deployment cannot run ffmpeg reliably, use a queue worker or a
compatible media service. Until the derivative exists, disable Free download with an
honest explanation. Never mark T6 complete for a CSS/player overlay.

Test the downloaded file itself, not only the player screenshot.

### Phase F — finish the product experience

#### Create

- On 390px, upload, top recipes, ownership confirmation and one Generate button are
  reachable without traversing the full recipe catalogue.
- Show the eight launch recipes first; move the rest behind search/“More recipes”.
- Keep advanced model/duration/prompt controls collapsed.
- Result shows input, output, provenance, actual metadata, settlement and download
  policy.
- Retry, variant and save actions follow Phase A semantics.

#### Seller Pack

- Three fixed children: Listing Spin 1:1, Blind-box Reveal 9:16, Social Flash 9:16.
- Each child has independent queue, success, failure, restored and unconfirmed state.
- Partial failure keeps successful outputs.
- ZIP/CSV export is enabled only for actually available deliverables.

#### Library

- Signed-in users get cloud projects and versions.
- Logged-out/local history remains labeled `Saved on this device`.
- Project grouping, reopen, retry and download use the same canonical records.

#### Home, Explore and project proof

- Keep exactly eight homepage proof entries.
- Every proof entry has a distinct input and output file.
- Project page records provenance, model, parameters and quality review.
- Remove legacy shelves or feature doors that distract from
  Home → Project → Use recipe → Create.
- No inaccessible nested focus controls.

Inspect `origin/agent/claude/ui-quality` before reuse. Port only compatible,
finished visual improvements and preserve the current product flow.

### Phase G — proof, quality and performance

For each official project record:

- owned/licensed input;
- provider task ID when live;
- exact model and parameters;
- output files;
- identity, motion, artifacts, composition and commercial-use scores;
- reviewer notes.

Homepage proof requires every score at least 4/5. Any score below 3 rejects the
project.

No paid model call is authorized by this document. Prepare the harness and cost
estimate. When `FAL_KEY` and a budget are needed, put one exact request in
`docs/BLOCKERS_REQUEST.md`, including number of jobs, model, maximum spend and stop
condition.

Performance:

- ordinary 4G hero poster/content visible within three seconds;
- one mobile video playing at a time;
- nonhero media loads poster/metadata only;
- no giant Base64 history;
- measure mobile LCP, CLS and interaction latency on private preview;
- fix material regressions before release.

### Phase H — SEO and analytics without thin pages

- Index only pages with a working tool, unique intent, proof and FAQ.
- Pages without proof stay planned, redirected or `noindex`.
- Private pages, Library, Profile and Settings remain `noindex`.
- Stable canonical, sitemap timestamps, OG images and structured data.
- Add optional privacy-conscious analytics for:
  landing → project open → recipe use → upload → generation → result → export.
- No configured analytics key may break rendering.
- Search Console submission waits for the boss-controlled public-domain decision.

The existing 126 generated routes are not a success metric. Search usefulness and
proof quality are.

### Phase I — payment readiness, test mode only

After Phase C:

- Stripe test Checkout;
- durable webhook event IDs and idempotent processing;
- upgrade, downgrade, cancel, renewal, payment failure and Customer Portal;
- plan/credit projection reconciled from Stripe records;
- no yearly option unless a real test Price ID exists;
- payments feature flag defaults off;
- no live keys, live charge or public payment button.

Open live payment only after:

- durable auth/credits pass;
- concurrency and duplicate webhook tests pass;
- file-level watermark cannot be bypassed;
- true provider cost and gross-margin model are verified;
- private preview runs 72 hours without P0/P1 accounting defects;
- boss gives a separate explicit approval.

### Phase J — private release candidate

- Deploy a private/passworded preview only.
- Do not change `pikbo.ai` DNS.
- Run the full acceptance matrix at 390, 768 and 1440 px.
- Test slow media, provider timeout, duplicate webhook, insufficient credits,
  canceled job, partial Seller Pack failure, refresh recovery and cross-device login.
- Crawl every public link and verify canonical/noindex behavior.
- Record release SHA, preview URL, health output, CI URL and known limitations.

Public DNS and public charging remain separate boss-authorized actions.

## 5. Required validation commands

Use repository scripts; repair them when they cannot express demo vs soft-live
correctly.

```bash
npm run check:conflicts
npm run engine-smoke
npm run lint
npm run typecheck
npm run build
npm run link-check
npm run critical-path
```

Add focused tests for ledger transactions, idempotency, generation state,
watermarked download authorization and Seller Pack partial failure.

## 6. Git and reporting protocol

- Work only from current `main`.
- One phase per small commit where practical.
- Commit prefix `[grok]`.
- Never force-push `main`.
- Explicitly stage only owned files.
- Rebase or merge current `main` before final review.
- Update `docs/STATUS.md` and prepend `docs/HANDOFF.md` after every phase.
- `done` requires code plus reproducible evidence.
- `blocked` requires exact external dependency and completed adjacent no-cost work.

Suggested commit sequence:

```text
[grok] fix attempt settlement and version semantics
[grok] add deterministic CI and demo/live health gates
[grok] implement durable auth and credit ledger
[grok] add async generation jobs and stored assets
[grok] protect free downloads with file watermark
[grok] finish mobile Create, Seller Pack and cloud Library
[grok] add proof QA, performance and analytics gates
[grok] complete Stripe test-mode readiness
[grok] validate private release candidate
```

Push:

```bash
git push -u origin agent/grok/final-takeover
```

Open a PR to `main`; keep it draft until each completed phase has green checks.

## 7. External blockers — one consolidated boss request

Do not repeatedly interrupt the boss. Create `docs/BLOCKERS_REQUEST.md` only after
all unblocked work is complete. Request only what is still required:

- Supabase project URL and server/client keys;
- approved auth redirect URLs;
- FAL key and a capped test budget;
- object-storage credentials/bucket;
- Stripe **test-mode** keys and Price IDs;
- Vercel access for a private preview;
- later, explicit approval for public DNS and live payment.

Never place secrets in GitHub, logs, screenshots, HANDOFF or client code.

## 8. Final definition of done

The takeover is complete only when:

- all no-cost phases are merged;
- CI is visibly green on the release commit;
- demo mode works with no provider key;
- soft-live readiness is accurately reported;
- durable account/credits and async jobs pass tests;
- raw Free output cannot be downloaded;
- Retry/Variant/refund semantics are correct;
- Seller Pack survives partial failure;
- private preview passes responsive and performance checks;
- every remaining external blocker is in one concise request;
- Stripe live and public DNS are still off unless separately approved.
