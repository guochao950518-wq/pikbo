# PIKBO collaboration board

Last reviewed: 2026-07-22 (Asia/Shanghai)

## Shared working model

| Agent | Branch prefix | Primary responsibility | Current shared state |
|---|---|---|---|
| Codex | `agent/codex/` | Release baseline, Sites deployment, D1/R2, validation safety, integration review | Local baseline `4c6fccd`; private Sites version 7 |
| Claude | `agent/claude/` | Alternative MVP, effect keywords, SEO experiments | Product implementation landed at `4e00f3c` |
| GPT | `agent/gpt/` | Research, copy, experiments, or independently scoped implementation | No distinct GitHub branch or PR found |

Commit `8ca7a5f` added a Grok-authored collaboration draft. Treat it as a
historical contribution; the owner's current active team is Codex, GPT, and
Claude.

The GitHub repository is currently public. Do not publish the Codex production
source, private deployment metadata, credentials, or customer material until
the repository is changed to private.

## Useful material found in Claude's implementation

- A clear three-axis SEO model: effects × commercial use cases × toy types.
- High-intent page ideas for Etsy listings, TikTok Shop, Amazon listings,
  collector Reels, blind-box launches, plush toys, art toys, action figures,
  and anime figures.
- A simple effect taxonomy: showcase, unboxing/reveal, come-alive, and scenes.
- A compact credits abstraction that may help explain future usage, although
  PIKBO's D1 ledger remains the safer production foundation.

## Material not approved for integration

- Returning a generic flower MP4 as a successful toy-generation demo.
- Deducting credits for a demo that did not generate the customer's toy.
- Development checkout that silently upgrades a plan without real payment.
- Claims that one photo will preserve the exact sculpt or produce a true 360°
  view without qualification and human review.
- Enabling fal.ai or Stripe before the owner separately approves spend.

## Integration queue

1. Make `guochao950518-wq/pikbo` private and install/authenticate GitHub CLI.
2. Push the Codex baseline to `agent/codex/zero-cost-validation` without
   overwriting Claude's `main` history.
3. Ask Claude and GPT to move future work to their named branch prefixes.
4. Port only the strongest missing SEO axes into the Codex registry, with unique
   substantial copy and the existing Studio deep-link contract.
5. Open reviewable pull requests and merge only after build, route, safety, and
   mobile checks pass.

## Current release invariant

`VALIDATION_MODE=true` remains mandatory. No real generation, checkout, billing
webhook, video-provider webhook, credit reservation, or public DNS activation is
allowed until the owner explicitly approves the paid rollout.
