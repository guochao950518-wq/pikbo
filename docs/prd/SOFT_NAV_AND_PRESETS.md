# Soft-launch navigation and proof whitelist

**Status:** Frozen v1
**Owner:** GPT
**Last reviewed:** 2026-07-23

## Navigation

Desktop primary navigation contains five destinations:

| Label | Route | Soft-launch job |
|---|---|---|
| Explore | `/explore` | Browse labeled recipes and examples |
| Create | `/create` | Upload → choose recipe → quote/generate |
| Effects | `/effects` | Find all registered toy recipes |
| Lab | `/community` | Browse official PIKBO product demonstrations |
| Pricing | `/pricing` | See the current finite 1 / 5 / 15 allowance contract |

Utilities:

- Primary CTA `Generate` → `/create`
- `More` may contain Library and Guides.
- Models, Cinema, Image, Batch, and Feed are not primary navigation. If a
  preview route remains reachable, it must say `Preview` or `Coming soon`
  according to actual capability.

Mobile bottom navigation:

1. Home
2. Effects
3. Generate
4. Examples
5. Pricing

No model marketplace, Cinema, Batch, Feed, or Library appears as a primary peer
of Create during soft launch.

## Homepage proof whitelist

The homepage may show at most these eight registered recipes:

1. `floating-hero`
2. `blind-box-unboxing`
3. `miniature-scene`
4. `paparazzi-flash`
5. `360-spin-showcase`
6. `mystery-box-reveal`
7. `make-figure-dance`
8. `display-case-glam`

Requirements:

- One unique media asset per card.
- Badge is `Official example · cached`.
- The card does not claim the media was generated from the current visitor's upload.
- The detail link is `/effects/<slug>` and the action deep link is `/create?effect=<slug>`.
- A recipe without a traceable, approved output is removed from the eight rather than filled with a shared loop.
- `Live generation` is reserved for a returned live job, not for a configured provider or cached asset.

## Linked-route inventory

These links must return 200 or an intentional permanent redirect:

- `/`
- `/explore`
- `/create`
- `/effects`
- `/community`
- `/pricing`
- `/privacy`
- `/terms`
- every `/effects/<registered-slug>`
- every `/for/<registered-slug>`
- every `/toys/<registered-slug>`
- every `/guides/<registered-slug>`

Private/device routes may return 200 but must be `noindex`: `/profile`, `/settings`, `/library`.

## Day-of public checklist

1. Confirm all primary links and footer links return 200/intentional redirect.
2. Confirm homepage contains one H1 and one primary action.
3. Count homepage proof cards: no more than eight, no duplicate video URL.
4. Confirm every example says `Official example · cached`; no fake usernames or engagement.
5. Run three owned-toy live jobs and save provider IDs.
6. Force one provider failure and verify the 10-credit refund response.
7. Verify cached mode costs zero and says it did not animate the upload.
8. Verify production `/api/dev/topup` is forbidden.
9. Verify `SESSION_SECRET` and `FAL_KEY`; keep payments disabled.
10. Run lint, typecheck, production build, critical-path checks, then record evidence in HANDOFF.

Public status stays NO-GO if any item fails.
