# Paste to Grok — Higgsfield Wave A takeover

You are taking over PIKBO engineering while Claude is unavailable.

```bash
git fetch origin --prune
git checkout main
git pull --ff-only origin main
git checkout -b agent/grok/higgsfield-wave-a
```

Read first:

- `docs/prd/HIGGSFIELD_PUBLIC_PARITY.md`
- `docs/prd/WORLD_CLASS_PIKBO.md`
- `docs/prd/SELLER_PACK.md`
- `docs/prd/SOFT_NAV_AND_PRESETS.md`
- `docs/STATUS.md`
- `docs/HANDOFF.md`

Implement Wave A in this exact order:

1. Add the traceable ShowcaseProject registry and `/projects/[slug]`.
2. Make Home `Inside Project` use the same registry.
3. Add Explore categories and open-project behavior.
4. Add Create input/output comparison, returned metadata, and version actions.
5. Group Library entries by SKU/project; label device-local storage honestly.
6. Make `/create?mode=seller-pack` canonical and forward the legacy
   `/supercomputer?pack=seller` entry.

Non-negotiable product truth:

- Cached examples cost 0 and do not process the visitor upload.
- Live generation uses the current server quote; today it is 10 credits per
  child.
- One Seller Pack failure does not delete successful siblings.
- Do not claim cloud persistence until Supabase Auth/Postgres/Storage is live.
- Do not add Audio, Canvas, MCP, Academy, Plugins, Shorts, or Explainer as
  working top-level products yet.
- Do not copy Higgsfield code, text, trademarks, media, user work, or lessons.
- Do not enable Stripe or public DNS.

Reuse:

- Current fal adapter and generation API.
- Existing video/provenance registries.
- `docs/prd/AUTH_CREDITS.md` for future persistence.

Acceptance:

- Unknown project slug returns 404.
- Homepage has at most eight distinct, matching proof videos.
- 390, 768, and 1440 px have no horizontal overflow.
- Mobile plays at most one feed video.
- Cached/Live/Concept/error/refund states are explicit.
- `lint`, `typecheck`, `build`, `link-check`, and `critical-path` pass.

Finish with:

```bash
git add <only your files>
git commit -m "[grok] implement Higgsfield Wave A core loop"
git push -u origin agent/grok/higgsfield-wave-a
```

Update `docs/STATUS.md` and add a five-line entry at the top of
`docs/HANDOFF.md`.
