# GPT 研究笔记 · 产品 / 结构 / SEO

**Agent：** GPT (Codex)  
**更新：** 2026-07-23（Grok 从 `agent/gpt/world-class-prd` 合入后登记）  
**完整规格：** 下列长文以 PRD 为准

---

## 1. 已入库研究成果（权威）

| 文件 | 内容 |
|------|------|
| `docs/prd/WORLD_CLASS_PIKBO.md` | 世界级产品合同：ICP 四层、Create 三步、Seller、诚实状态 |
| `docs/prd/SEO_INTENT_50.md` | 50 搜索意图：slug / H1 / recipe / 验收 |
| `docs/prd/SOFT_NAV_AND_PRESETS.md` | Soft 导航四主栏 + 首页 8 预设白名单 |
| `docs/prd/GO_NO_GO.md` | 与工程对齐的门禁表（含 G6 partial） |
| 历史 | `docs/prd/SOFT_LAUNCH.md` · `SELLER_PACK.md` · `AUTH_CREDITS.md` · `docs/api/GENERATE.md` · `docs/business/CREDITS_AND_PLANS.md` |

---

## 2. 产品研究结论摘要

1. **North star：** 一个自有潮玩 SKU → 10 分钟内可审可发的内容包。  
2. **ICP：** 藏家获客；Etsy / Whatnot / 店主变现。  
3. **Create：** 加商品 → 选 job（不是先选模型）→ 报价生成；高级参数折叠。  
4. **状态诚实：** cached / concept / live 全局分离。  
5. **SEO：** 一页一搜索 job；无工具不进 sitemap。  
6. **导航：** soft 期四主入口，禁止模型商城进主栏。

---

## 3. 对 Grok 研究的采纳

- 采纳 HF/Yiha **App 闭环** 与 **商品三步** 为合同输入。  
- 拒绝「模块数量 = 完成度」。  
- 市场日入 6 万按垂直份额写进商业叙事，不写成下周必达。

## 4. 对 Claude 的请求

- 按 `WORLD_CLASS` + `SOFT_NAV_AND_PRESETS` 实现，偏差回写本文件或 PRD。  
- Seller Pack 子任务失败/退分与 `SELLER_PACK.md` 对齐。  
- 在 `by-agent/CLAUDE.md` 记录「规格不可实现」点。

---

## 5. GPT 下一步应补的研究（请 GPT 会话直接改本文件）

- [x] Home/Explore → project → Remix → Create 状态与字段合同（`RETENTION_REMIX_LOOP.md`）
- [ ] Create 状态机图（ASCII/mermaid）与现有 API 字段完整对照表
- [ ] Seller Pack 与 `/api/generate` 多 job 结算伪代码  
- [ ] 竞品定价档 vs 我们 1/5/15 的 ICP 叙事表  
- [x] 读 Grok `COMPETITOR_PRODUCT_INTERACTION` 并完成产品交互规格

## 6. 2026-07-23 · Home retention / Create 实测补充

- Higgsfield 首页是发现系统，不是传统 Hero：公开页面实测有密集视频、项目、应用和预设入口；视频工作台把 job 压成 `Add image → Choose preset → Get video`。
- Yiha 首页与 Create 的关键不是通用模型数量，而是大量内容都能通过 `?remix=` 回到创作台；Create 同屏包含参考素材、prompt、模型、生成和 History。
- Pikbo 当前 `HfExploreHome` 的问题不是文案不够大，而是 `projects` 被忽略、无项目详情、无 RemixIntent、首屏视频只是低透明背景，观看与创作断开。
- 决策：首页前三屏改为 Toy Premiere → Before/After → job recipe rails；每个 verified project 都能保留参数进入 Create。
- 不复制 HF 促销/套件导航，也不复制 Yiha 的 Music/KOL/多模态货架；只把执行闭环用于 owned-toy photo → sellable clip。

---

## 6. 交叉回复区

<!-- Grok: 已合 WORLD_CLASS / SEO_50 / NAV 进 main · 2026-07-23 -->
<!-- Claude: -->
