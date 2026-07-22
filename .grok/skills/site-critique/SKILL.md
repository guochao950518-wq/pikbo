---
name: site-critique
description: >
  Competitor-first website/product-surface critique for Pikbo. Primary evidence:
  market-validated AI creative suites (Higgsfield, similar tool shelves) — modules
  that already earn traffic and money. Secondary: SEO/CRO ideas (哥飞, Namya) only
  as copy/SEO overlays. Use for 竞品对比, site review, /site-critique, 审站.
---

# Site Critique — 竞品站优先

## Principle (boss-aligned)

**竞品网站 = 已经被市场验证的产品形态。**  
流量与付费能力在他们那边成立 → 我们优先抄 **信息架构 / 模块 / 路径**，再潮玩化。

X 建站大神（哥飞、Namya 等）的观点 **只作辅料**：

- 用来写清 ICP、工具 SEO 内页、CTA 措辞  
- **不得**用「理论更清晰的营销站」推翻竞品已验证的 App/Explore 壳  

权威顺序：

1. 实站 + `docs/COMPETITOR_SITE_PATTERNS.md` + `docs/COMPETITOR_SPEC.md`  
2. `docs/GAP_AUDIT.md`  
3. 哥飞/Namya/AIDA（`references/experts.md`）  

## When invoked

1. Open competitor URLs (at least Higgsfield.ai home; pricing/community if reachable).  
2. Diff against Pikbo: `app/page.tsx`, AppShell, create, effects, community, library, pricing.  
3. Score **module parity with money path**, not aesthetic theory.  
4. Output P0/P1/P2 with file paths. Prefer implementable gaps.

## Primary lens · Market-validated suite (Higgsfield-class)

Check presence and quality of:

| Module | Why market cares |
|--------|------------------|
| Explore home of **playable** media | Retention + proof |
| Model/App shelf → one click generate | ARPU / discovery |
| Viral presets wall + view all | Session depth |
| Community **projects** (real users) | Trust + UGC SEO |
| Center **Generate** chrome | Activation |
| Library + Profile | Retention + billing |
| Free try / credits language | Funnel top |
| Pricing discoverable | Revenue |
| Flagship model campaign strip | Upgrade narrative |
| (Optional) Academy / contests | Growth loops |

Legal: recreate patterns only — no logos, copy, or media theft. No fake multi-model.

## Secondary lens · SEO (哥飞)

Apply to **inner tool pages** (`/effects/[slug]`, `/for/*`), not to force homepage into a brochure.

## Secondary lens · CRO copy (Namya / AIDA)

Fix headlines/CTAs/proof **inside** the suite structure. Do not replace video-first home with long-form SaaS landing unless data says so.

## Output format

```markdown
# Competitor-first critique — Pikbo

## Competitor snapshot
| Site | What market validates | Steal pattern | Don't steal |

## Parity scorecard (vs HF-class)
| Module | Competitor | Pikbo | Gap | Priority |

## Money-path gaps (P0)
1. …

## SEO/copy overlays (P1, secondary)
…

## Do not do
- Theory-driven redesign that undoes suite shell
- Fake models / fake social counts
```

## Slash

`/site-critique` or 「按竞品审站」「竞品优先意见」
