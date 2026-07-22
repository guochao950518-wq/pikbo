# Pikbo board — claim before you code

**Last human intent:** three agents (Grok / GPT / Claude) parallelize; always pull each other’s GitHub work.

Update this file in the same PR/commit as your work start/finish.

Legend: `todo` · `doing` · `review` · `done` · `blocked`

---

## Now

| ID | Task | Owner | Status | Branch | Notes |
|---|---|---|---|---|---|
| T1 | Multi-agent collab protocol + board | Grok | done | main | COLLAB.md + STATUS + HANDOFF |
| T2 | Real fal sample clips / homepage demos | GPT | done | agent/gpt/homepage-demos | 6 original encoded demos; cached/no FAL cost; verified fal renders can replace assets later |
| T3 | Keyword + preset expansion (long-tail SEO) | Claude | done | agent/claude/seo-keywords | +use-cases + toy-types |
| T4 | Stripe webhook (renew/cancel plan) | Grok | done | agent/grok/ship-billing-launch | webhook + confirm + entitlements |
| T5 | Supabase auth + durable credits | — | todo | — | Replaces file entitlements long-term |
| T6 | Server-side free watermark (ffmpeg) | — | todo | — | Player overlay is temporary |
| T7 | Vercel deploy + domain pikbo.ai | — | blocked | — | Boss: **先不做上线**，先抄站 |
| T10 | Boss one-command + Telegram bot | Grok | done | main | DISPATCH + tools/telegram_dispatch_bot.py |
| T11 | Higgsfield-class shell + Generate | Grok | done | main | AppShell + CreateStudio + Library history |
| T12 | Home model shelf + presets wall polish | GPT | done | agent/gpt/home-visuals | Live-model previews + demo-aware preset cards; roadmap models explicit |
| T13 | Presets/community density | Claude | done | main | PresetsWall on /effects + home |
| T14 | Local Library history | Grok | done | main | localStorage after generate |
| T15 | Generate duration/aspect/model controls | Grok | done | main | API + CreateStudio |
| T16 | Toy-native suite copy pass | Grok | done | main | catalog + pages |
| T17 | Batch generate (Shop agent) | Grok | done | main | /supercomputer BatchStudio |
| T18 | Profile live credits + Generate drag-drop | Grok | done | main | |
| T19 | Generate search/recent/progress/copy + mobile CTA | Grok | done | main | |
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
| D7 | Toy-first homepage demo theatre | GPT | `agent/gpt/homepage-demos` |
| D8 | Model shelf + demo-aware PresetsWall | GPT | `agent/gpt/home-visuals` |

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
