# 三方共享研究中心 · Shared Research Hub

**老板要求：** Grok / GPT / Claude **都要研究**，研究成果 **一律进仓库**，三 agent **共同阅读、共同迭代**。  
**本目录 = 唯一索引。** 不要把研究只放在对话里或私有笔记。

---

## 怎么用（所有 agent 强制）

### 开工前

1. 读本文件  
2. 读 [`SHARED_SYNTHESIS.md`](./SHARED_SYNTHESIS.md)（共识结论）  
3. 读另外两个 agent 在 `by-agent/` 下的最新笔记  
4. 再读权威长文（下表）

### 交研究成果

| 谁 | 写哪里 | commit 前缀 |
|----|--------|-------------|
| **Grok** | `by-agent/GROK.md` + 可增补 `SHARED_SYNTHESIS.md` | `[grok]` |
| **GPT** | `by-agent/GPT.md` + 规格进 `docs/prd/*` | `[gpt]` |
| **Claude** | `by-agent/CLAUDE.md` + 实现笔记/风险 | `[claude]` |

规则：

- **每人只编辑自己的 `by-agent/<NAME>.md` 主区**（可在别人文件底部「回复」区加一行交叉引用）  
- **共识变更** → 更新 `SHARED_SYNTHESIS.md` 并在 HANDOFF 写一条  
- **长文研究** 可放 `docs/` 根或 `docs/prd/`，但 **必须在本 README 索引表登记**  
- 分支：`agent/<who>/research-<topic>`，尽快 **merge 进 main**，否则别人读不到  

### 禁止

- 只在 chat 里研究不落盘  
- 三份互相矛盾的「最终结论」却不改 SHARED_SYNTHESIS  
- 抄竞品 logo/成片/原文案进产品  

---

## 索引 · 已入库研究

### A. 共享共识

| 文件 | 内容 | 维护 |
|------|------|------|
| [`SHARED_SYNTHESIS.md`](./SHARED_SYNTHESIS.md) | 三方对齐：竞品在做什么、Pikbo 抄什么/不抄 | **全员**（改结论时更新） |
| 本 README | 目录与协议 | Grok 协调 |

### B. 按 agent 笔记（短、可扫）

| 文件 | 角色焦点 |
|------|----------|
| [`by-agent/GROK.md`](./by-agent/GROK.md) | 竞品交互、增长、差异化、市场量级 |
| [`by-agent/GPT.md`](./by-agent/GPT.md) | 产品合同、ICP、导航白名单、SEO 意图、状态机 |
| [`by-agent/CLAUDE.md`](./by-agent/CLAUDE.md) | 工程实现差距、前端交互可落地性、性能/风险 |

### C. 权威长文（全员必读）

| 文件 | 作者侧重 | 说明 |
|------|----------|------|
| [`docs/COMPETITOR_PRODUCT_INTERACTION.md`](../COMPETITOR_PRODUCT_INTERACTION.md) | Grok | HF + Yiha **产品交互深解** |
| [`docs/COMPETITOR_SITE_PATTERNS.md`](../COMPETITOR_SITE_PATTERNS.md) | Grok | 竞品站模块形态 |
| [`docs/COMPETITOR_SPEC.md`](../COMPETITOR_SPEC.md) | 早期规格 | 模块-for-模块 clone 边界 |
| [`docs/FEATURE_MAP.md`](../FEATURE_MAP.md) | 工程对照 | 功能 parity 表 |
| [`docs/GAP_AUDIT.md`](../GAP_AUDIT.md) | 差距审计 | 历史 gap |
| [`docs/prd/WORLD_CLASS_PIKBO.md`](../prd/WORLD_CLASS_PIKBO.md) | **GPT** | 世界级产品合同 |
| [`docs/prd/SEO_INTENT_50.md`](../prd/SEO_INTENT_50.md) | **GPT** | 50 搜索意图 |
| [`docs/prd/SOFT_NAV_AND_PRESETS.md`](../prd/SOFT_NAV_AND_PRESETS.md) | **GPT** | 导航/8 预设白名单 |
| [`docs/prd/GO_NO_GO.md`](../prd/GO_NO_GO.md) | 共同 | 上线门禁 |
| [`docs/MOONSHOT_WORLD_CLASS.md`](../MOONSHOT_WORLD_CLASS.md) | Grok | 市场与 W 柱子 |
| [`docs/BRUTAL_EXPERT_ROAST_2026-07-23.md`](../BRUTAL_EXPERT_ROAST_2026-07-23.md) | Grok | 毒舌审站 |
| [`docs/growth/DIFFERENTIATION.md`](../growth/DIFFERENTIATION.md) | Grok | 潮玩差异化 |

### D. 原始竞品 URL（研究时打开）

- https://higgsfield.ai/  
- https://higgsfield.ai/flow  
- https://higgsfield.ai/cinematic-video-generator  
- https://higgsfield.ai/ai-product-video-generator  
- https://yiha.ai/ · `/create` · `/explore` · `/membership`  

---

## 粘贴任务（给 GPT / Claude）

见 [`docs/PASTE_SHARED_RESEARCH.md`](../PASTE_SHARED_RESEARCH.md)。

---

## 变更日志

| 日期 | 谁 | 事 |
|------|-----|-----|
| 2026-07-23 | Grok | 建 hub；登记已有研究；合入 GPT WORLD_CLASS / SEO_50 / NAV 白名单 |
