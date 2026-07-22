# DISPATCH — 三 agent 全开工（老板定）

**Last human intent:**  
- **Claude** = 网站设计 / 审美 UI（别闲着改视觉）  
- **Codex (GPT)** = 转化文案、定价诚实、数字对齐、过度承诺清扫（别闲着改 API）  
- **Grok** = 出片水管、契约、积分、限流、合流、部署协助  

**协调 / merge：** Grok  

---

## 车道（硬边界）

| Agent | 擅长 · 只做这些 | 禁止 |
|-------|-----------------|------|
| **Claude** | 视觉、布局 polish、字体、动效、质感、HF 审美 | `app/api/*` · session/pricing/contracts/generate |
| **Codex/GPT** | 定价/转化文案 · 数字与 `lib/pricing.ts` 对齐 · 假承诺清扫 · FAQ/空态文案 · 单位经济文档 | 改 API · 大改 AppShell/首页视觉骨架 · 假 live/假 UGC |
| **Grok** | fal 出片 · credits/session · rate limit · preflight · merge · LAUNCH 协助 | 抢 Claude 审美大改 |

---

## Codex 立刻开干（开工口令见下）

| ID | Task | Status | Branch |
|----|------|--------|--------|
| **C1** | 全站文案数字对齐 `lib/pricing.ts`：Free ~1 片 / Creator ~5 / Shop ~15 | **done** (pricing page) · PR#12 merged | `agent/gpt/pricing-truth-main` |
| **C2** | `PricingUsageEstimator` + pricing FAQ 对齐 | **done** · merged | 同上 |
| **C3** | `docs/UNIT_ECONOMICS.md` 与 Mini free + 现行积分同步 | **todo** · next | `agent/gpt/truth-sync` |
| **C4** | CreateStudio / paywall / 空态字符串诚实 | **todo** · next | 同上 |
| **C5** | README 顶部数字与 pricing 一致 | **todo** · next | 同上 |

**验收：** `npm run lint` 绿；不改 `app/api`、`lib/session.ts`、`lib/credits.ts`、`lib/contracts.ts` 逻辑。  
**提交：** `[gpt]` 前缀 · push 分支 · Grok 合流 main。

---

## Claude 继续

| ID | Task | Branch |
|----|------|--------|
| UI | 审美 UI quality（font / grain / craft） | `agent/claude/ui-quality` |

---

## Grok 继续

| ID | Task | Status |
|----|------|--------|
| Eng | demo map / rate limit / dev topup | done · main |
| Merge | Claude UI + Codex truth 合流 | waiting |
| T7 | Boss Vercel | blocked |

---

## 复制给 Codex 的开工口令（整段粘贴）

```text
你是 Pikbo 三 agent 里的 Codex/GPT。立刻干活，不要闲着。

git fetch origin && git checkout main && git pull origin main
git checkout -B agent/gpt/truth-sync

读：
- docs/DISPATCH.md（你的车道 C1–C5）
- docs/GPT.md
- lib/pricing.ts（唯一数字真相：Free 10 credits≈1 片，Creator 50≈5，Shop 150≈15；free=Mini 480p）
- docs/UNIT_ECONOMICS.md

只做 C1–C5：
1) 全站扫过时积分/片数/「Fast 免费无限」等假或旧文案，改成与 lib/pricing.ts 一致
2) PricingUsageEstimator / pricing FAQ / PricingHeroCopy 对齐
3) UNIT_ECONOMICS 同步 Mini free + 现行 allowance
4) CreateStudio/Paywall 等字符串诚实（demo vs live）；不改布局 CSS 大改
5) README 数字对齐

禁止：
- 改 app/api/**
- 改 lib/session.ts lib/credits.ts lib/contracts.ts lib/models.ts 逻辑
- 大改 AppShell / 首页视觉骨架（那是 Claude 的）
- 假 UGC、假 live、假 unlimited

做完：npm run lint
commit 前缀 [gpt]，push origin agent/gpt/truth-sync
在 docs/HANDOFF.md 顶记一条；docs/STATUS.md claim C1–C5 done

Grok 会合流。开始写代码。
```

---

## 复制给 Claude 的口令（设计）

```text
git pull。只做网站设计与 UI 审美（agent/claude/ui-quality）。
禁止改 app/api 与 lib 计费/生成契约。Codex 在改文案数字；视觉你说了算。
```
