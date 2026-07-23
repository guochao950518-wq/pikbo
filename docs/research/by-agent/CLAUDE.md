# Claude 研究笔记 · 工程 / 交互可落地 / 实现差距

**Agent：** Claude  
**更新：** 2026-07-23（Grok 建档；**请 Claude 用研究填充**）  
**职责：** 把 HF/Yiha/GPT 规格 **翻译成代码现实**；记录可做/难做/风险。

---

## 1. 必读（实现前）

1. `docs/research/SHARED_SYNTHESIS.md`  
2. `docs/COMPETITOR_PRODUCT_INTERACTION.md`（Grok）  
3. `docs/prd/WORLD_CLASS_PIKBO.md` + `SOFT_NAV_AND_PRESETS.md`（GPT）  
4. 本文件历史实现笔记  

---

## 2. 工程侧已观察到的事实（Grok 代填骨架 · Claude 请修正）

| 区域 | 现状（main） | 相对竞品交互 | 风险 |
|------|--------------|--------------|------|
| AppShell | 主栏收敛 + More | 接近 soft 白名单 | 部署后需再爬 |
| Create | 旗舰路径 Photo→Recipe→Generate；demo/live 条 | 接近 Yiha/HF 主台简化版 | 与 WORLD_CLASS「job 选择」是否完全同构待核 |
| Home | ≤8 证明墙 + seller CTA | 结果优先方向对 | 8 片质量/provenance |
| Seller Pack | `?pack=seller` MVP | 薄于 HF Product Studio | 三输出结算需对照 PRD |
| Library | localStorage | 弱于 HF/Yiha 云 History | soft 可接受 |
| Models/Cinema | 路由在，主栏已藏 | 勿重新装主路径 | 空壳回潮风险 |
| 性能 | 视频 preload 已限 | HF 仍更顺 | LCP 公网再测 |
| 积分 | guest cookie + Coming soon | 无真订阅 | T5 阻断收费 |

---

## 3. Claude 研究任务（请在会话中完成并改本文件）

### 3.1 对照实现矩阵（必填）

对 `COMPETITOR_PRODUCT_INTERACTION` 的 P0 交互，逐条：

| 交互能力 | 代码位置 | 完成度 0–5 | 缺口 | 预估工时 |
|----------|----------|------------|------|----------|
| 结果优先媒体墙 | | | | |
| 一键完整配方 | | | | |
| Create 四段 IA | | | | |
| Seller 三步 | | | | |
| 失败退分可见 | | | | |
| Remake 深链 | | | | |

### 3.2 规格冲突清单

若 `WORLD_CLASS` 与当前 API/组件冲突，列在这里 → 回 GPT。

### 3.3 性能与前端

- 首页同时播视频上限  
- 移动 390 Create sticky CTA 与底栏关系  
- RSC/客户端边界  

---

## 4. 已实现相关 commit（便于追溯）

- shell-triage / world-class Create / i18n / link aliases — 见 `docs/HANDOFF.md`  

---

## 5. 交叉回复区

<!-- Grok: 请填 §3 矩阵后更新 SHARED_SYNTHESIS 开放问题 -->
<!-- GPT: -->
