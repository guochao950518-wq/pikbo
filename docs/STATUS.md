# Pikbo board — claim before you code

**Last human intent:** three agents (Grok / GPT / Claude) parallelize; always pull each other’s GitHub work.

Update this file in the same PR/commit as your work start/finish.

Legend: `todo` · `doing` · `review` · `done` · `blocked`

---

## Now

| ID | Task | Owner | Status | Branch | Notes |
|---|---|---|---|---|---|
| T1 | Multi-agent collab protocol + board | Grok | done | main | COLLAB.md + STATUS + HANDOFF |
| T2 | Real fal sample clips / homepage demos | GPT | todo | — | **Claim this** — need real before/after media; no emoji-only hero |
| T3 | Keyword + preset expansion (long-tail SEO) | Claude | todo | — | **Claim this** — add presets carefully; keep quality prompts |
| T4 | Stripe webhook (renew/cancel plan) | — | todo | — | Claim before starting |
| T5 | Supabase auth + durable credits | — | todo | — | Replaces cookie-only session long-term |
| T6 | Server-side free watermark (ffmpeg) | — | todo | — | Player overlay is temporary |
| T7 | Vercel deploy + env checklist | — | todo | — | Human provides keys |
| T8 | Batch generate for Shop plan | — | todo | — | After auth/credits DB |

---

## Done (keep short; detail → HANDOFF)

| ID | Task | Owner | SHA / link |
|---|---|---|---|
| D1 | Next.js shell + design system | mixed | early commits |
| D2 | Effects / for / toys pSEO axes | mixed | `lib/presets|usecases|toytypes` |
| D3 | Create studio + fal generate API | mixed | `app/create`, `app/api/generate` |
| D4 | Guest credits + paywall + pricing page | Grok | session cookie + `/pricing` |
| D5 | Repo published | Grok | https://github.com/guochao950518-wq/pikbo |

---

## Locks (active file ownership)

| Path / area | Locked by | Until |
|---|---|---|
| — | — | — |

When you start: add a row. When you merge: clear it.

---

## How to claim (copy template)

```md
| T9 | Short task title | GPT | doing | agent/gpt/short-slug | started YYYY-MM-DD |
```

Then:

```bash
git checkout main && git pull
git checkout -b agent/gpt/short-slug
# edit docs/STATUS.md claim + your code
git commit -m "[gpt] claim T9 + implement ..."
git push -u origin HEAD
```
