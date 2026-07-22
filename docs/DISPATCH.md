# 老板指令板 — 三 agent 拉满 · 把站做完

**更新：** 2026-07-23（Grok 协调刷新）  
**仓库：** https://github.com/guochao950518-wq/pikbo  
**原则：** **竞品站优先**（`docs/COMPETITOR_SITE_PATTERNS.md`）> SEO/文案理论。  
**上线：** 老板闸门仍在；先把产品做真、做诚实，再部署。

---

## 老板意图（白话）

```
三个 agent 都要发挥最大能力，一起把 Pikbo 网站建好。
不是再堆空壳，是：能出片、能转化、能搜到、别丢人。
```

---

## 现状（一句话）

| 层 | 状态 |
|----|------|
| App 壳 / 视频首页 / Community 项目卡 / Seedance 战役 / UI kit | **已有**（main 上大量 [grok]） |
| SEO presets / guides / for·toys 轴 | **已有**（[claude]） |
| 首页 demo 剧场 / 定价估算器 | **已有**（[gpt]） |
| 真出片证明 | 需本机/部署配置 **`FAL_KEY`**（见 `.env.example`） |
| 真账号 + 持久积分 | **T5 未做** → 真 Stripe 仍风险 |
| 服务端水印 burn-in | **T6 未做** |

---

## 死分工（发挥最大能力 · 禁止抢活）

### 🟢 Grok — 引擎 + 壳 + 钱 + 上线门禁

**擅长：** 全栈、API、支付、Generate、修挂、CI、竞品模块工程化  

| ID | 任务 | 状态 |
|----|------|------|
| G1 | CI：`npm run build` + 冲突标记扫描 | 模板在 `docs/CI_WORKFLOW.yml`（GitHub OAuth 无 workflow 权限时不能自动推 `.github/`；老板可网页创建 Actions） |
| G2 | 生成链路：扣费/失败退款契约 + 结果区诚实提示 | 本轮做 |
| G3 | LIVE/SOON 货架诚实、Pricing chrome、UI kit | 已完成 |
| G4 | ffmpeg 水印 burn-in（T6） | 下一刀 |
| G5 | 合流 Codex/Claude PR，修冲突 | 持续 |
| G6 | 部署脚本/预检（T7 等老板） | 阻塞 |

**锁文件区：** `app/api/**` · `components/CreateStudio.tsx` · `components/AppShell.tsx` · `lib/session.ts` · `lib/credits.ts` · `lib/stripe.ts` · `.github/**`  
**分支：** 直接 `main` 或 `agent/grok/<topic>`　**提交：** `[grok]`

---

### 🔵 Codex / GPT — 转化 + 视觉完成度 + 单位经济

**擅长：** 首页冲击、定价话术、样片观感、转化漏斗  

| ID | 任务 | 状态 |
|----|------|------|
| C1 | 首页扫一遍：**禁止暗示无限量**（已无 Endless clips；再扫 overclaim） | **已完成（PR #6）** |
| C2 | 所有 demo/project 卡统一 **Cached / Official example** 标注 | **已完成（PR #6）** |
| C3 | 单位经济：Seedance 真实成本 vs Free 3 条 / Creator 定价 — 写 `docs/UNIT_ECONOMICS.md` + 建议是否砍免费额度 | 下一步（T26） |
| C4 | Pricing 页转化句 A/B（只改文案组件，**不改** checkout API） | 可选 |
| C5 | 首页第一屏 390px 视觉验收 + 微调（不重写壳） | 可选 |

**锁文件区：** `components/HeroVideoBanner.tsx` · `components/HomeDemoShowcase.tsx` · `components/PricingUsageEstimator.tsx` · `components/HomeModelShelf.tsx` · `docs/UNIT_ECONOMICS.md`  
**禁止改：** `app/api/generate/**` · session/credits/stripe  
**分支：** C1–C2 `agent/gpt/claude-copy-audit`；C3 `agent/gpt/convert-truth`　**提交：** `[gpt]`

---

### 🟣 Claude — SEO 内容机器 + 潮玩文案 + 协调质检

**擅长：** 长文、关键词矩阵、效果页、内链、审查  

| ID | 任务 | 状态 |
|----|------|------|
| L1 | 全部 `lib/presets.ts` **tagline/intro 潮玩第二轮**（卖家/收藏家语言，不灌水） | **认领做** |
| L2 | 10 个高意图 effect 页 FAQ 加强异议（水印/商用/需要几张图） | **认领做** |
| L3 | `guides` +1～2 篇长尾（内链到 create + effects） | 可选 |
| L4 | 抽查 main：文案矛盾 / 空 SOON 模块 / 假 UGC — 写进 DISPATCH 下节 | 持续协调 |

**锁文件区：** `lib/presets.ts` · `lib/guides.ts` · `lib/usecases.ts` · `lib/toytypes.ts` · `app/guides/**` · `app/effects/**` 的**文案结构**（不改 LandingToolPanel 生成逻辑）  
**分支：** `agent/claude/copy-seo-v2`　**提交：** `[claude]`

---

## 三家共用开工口令（复制给 Codex / Claude）

```text
你是 Pikbo 三 agent 之一。仓库：https://github.com/guochao950518-wq/pikbo

git fetch origin --prune && git checkout main && git pull --ff-only

必读（按序）：
1. docs/DISPATCH.md —— 只做「你」那一节的未完成任务
2. docs/STATUS.md —— 开工 claim，做完改 status
3. docs/HANDOFF.md —— 复用已有组件，禁止重造
4. docs/COMPETITOR_SITE_PATTERNS.md —— 竞品优先

规则：
- 分支 agent/<gpt|claude>/<topic>
- 提交前缀 [gpt] 或 [claude]
- 只 git add 自己的文件，禁止 git add -A
- 不碰别人锁的路径
- 禁止假 UGC、假多模型、盗竞品素材
- push 后在 docs/HANDOFF.md 顶部写 5 行复用说明

目标：发挥你最大能力，把分配给你的任务做到可合并质量，帮老板把网站建好。
```

### 发给 Codex 时再加一行

```text
你是 Codex/GPT。只做 DISPATCH 里「Codex/GPT」表 C1–C5。从 C1+C2+C3 开始。
```

### 发给 Claude 时再加一行

```text
你是 Claude。只做 DISPATCH 里「Claude」表 L1–L4。从 L1+L2 开始。
```

### 我（Grok）本会话

继续 G1–G2，并保持协调刷新 DISPATCH。

---

## 协作硬规则（再贴一次）

1. **共享大脑 = GitHub**，不是三家自动开语音。  
2. **一人一块**；冲突时 Grok 合流。  
3. **诚实 > 看起来大。**  
4. 需要老板的：**FAL_KEY**、是否允许上线、Stripe 价是否最终。  

---

## 法律红线

禁止提交竞品 logo/官网素材/整页文案。结构对齐即可。
