# Pikbo board — claim before you code

**Last human intent:** three agents (Grok / GPT / Claude) parallelize; always pull each other’s GitHub work.

Update this file in the same PR/commit as your work start/finish.

Legend: `todo` · `doing` · `review` · `done` · `blocked`

---

## Now

| ID | Task | Owner | Status | Branch | Notes |
|---|---|---|---|---|---|
| T1 | Multi-agent collab protocol + board | Grok | done | main | COLLAB.md + STATUS + HANDOFF |
| T2 | Real fal sample clips / homepage demos | GPT | todo | — | Hero pipeline done by Grok; still need **real video files** |
| T3 | Keyword + preset expansion (long-tail SEO) | Claude | done | agent/claude/seo-keywords | +use-cases + toy-types |
| T4 | Stripe webhook (renew/cancel plan) | Grok | done | agent/grok/ship-billing-launch | webhook + confirm + entitlements |
| T5 | Supabase auth + durable credits | — | todo | — | Replaces file entitlements long-term |
| T6 | Server-side free watermark (ffmpeg) | — | todo | — | Player overlay is temporary |
| T7 | Vercel deploy + domain pikbo.ai | — | blocked | — | Boss: **先不做上线**，先抄站 |
| T10 | Boss one-command + Telegram bot | Grok | done | main | DISPATCH + tools/telegram_dispatch_bot.py |
| T11 | Higgsfield-class shell + Generate | Grok | doing | main | AppShell + CreateStudio + library/profile/community |
| T12 | Home model shelf + presets wall polish | GPT | todo | — | COMPETITOR_SPEC home |
| T13 | Presets/community density | Claude | done | agent/claude/clone-presets | PresetsWall (generate-prefilled) on /effects; reusable for home. Real community needs FAL_KEY |
| T8 | Batch generate for Shop plan | — | todo | — | After auth/credits DB |
| T9 | Effect preset expansion (studio + SEO landing) | Claude | done | agent/claude/seo-presets | +3 effects |
| T11 | Guides: informational long-tail content | Claude | done | agent/claude/guides | 3 how-to/tips/ideas articles at /guides; Article+FAQ JSON-LD; cross-linked to effects |

---

## Done (keep short; detail → HANDOFF)

| ID | Task | Owner | SHA / link |
|---|---|---|---|
| D1 | Next.js shell + design system | mixed | early commits |
| D2 | Effects / for / toys pSEO axes | mixed | `lib/presets|usecases|toytypes` |
| D3 | Create studio + fal generate API | mixed | `app/create`, `app/api/generate` |
| D4 | Guest credits + paywall + pricing page | Grok | session cookie + `/pricing` |
| D5 | Repo published | Grok | https://github.com/guochao950518-wq/pikbo |
| D6 | Stripe webhooks + confirm + legal pages | Grok | this branch |

---

## Locks (active file ownership)

| Path / area | Locked by | Until |
|---|---|---|
| — | — | — |

When you start: add a row. When you merge: clear it.

---

## How to claim (copy template)

```md
| T10 | Short task title | GPT | doing | agent/gpt/short-slug | started YYYY-MM-DD |
```

Then:

```bash
git checkout main && git pull
git checkout -b agent/gpt/short-slug
# edit docs/STATUS.md claim + your code
git commit -m "[gpt] claim T10 + implement ..."
git push -u origin HEAD
```
