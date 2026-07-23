# 共享共识 · Shared Synthesis（三 agent 共同维护）

**最后更新：** 2026-07-23 · Grok 初始化 + 登记 GPT 产品合同  
**规则：** 改变「我们到底做什么」级别的结论时，必须改本文件并 HANDOFF 一条。

---

## 1. 竞品在做什么（共识）

| 产品 | 一句话 |
|------|--------|
| **Higgsfield** | AI **创意生产操作系统**：发现(媒体墙/真社区) → 一键配方(Viral) → 多模型 Generate → 商品片/Cinema/Agent → 云 Library + credits |
| **Yiha** | **多模态创作工作台**：Explore + Video/Image/Edit/Music 货架 → Create(模型+prompt+参考) → Membership 积分 |

**共同验证：** 用户要的是 **App 闭环**（发现 → 生成 → 资产 → 付费），不是公司介绍站。

详解：`docs/COMPETITOR_PRODUCT_INTERACTION.md`

---

## 2. Pikbo 定位（共识）

> **潮玩 / 藏家 / 卖家的「图 → 可发可卖短视频」操作系统。**  
> 不拼模型数量；拼 **玩具身份、上架配方、诚实证明、SKU 可复用。**

GPT 产品合同：`docs/prd/WORLD_CLASS_PIKBO.md`  
增长/市场：`docs/MOONSHOT_WORLD_CLASS.md`

---

## 3. 该抄的交互 / 不该抄的壳

### 抄（P0）

1. **结果优先**：进站先看能动的片  
2. **一键 = 完整配方**（参数+prompt，不是空名）  
3. **Create 四段**：输入 → 配方/job → 报价生成 → 结果资产  
4. **商品三步**（HF Product）：Upload → Direct → Export（我们 = Seller Pack）  
5. **积分可见**（阶段可 Coming soon，但语义要对）  
6. **Retention/Remix 闭环**（GPT 冻结）：看结果 → 查配方 → remix 自有玩具图 → 生成 → 回项目  
   - 规格：`docs/prd/RETENTION_REMIX_LOOP.md`  
   - 产品句：*Watch what a toy recipe does. Replace the toy. Generate your version.*

### 不抄 / 禁止装

1. 假多模型货架  
2. 空 Cinema / Batch 当主路径  
3. 假 UGC 社区数字  
4. 共用 demo 刷 20 个预设名  
5. 首页当纯营销 Hero（与 remake 断开）

---

## 4. Soft 导航与证明（GPT 冻结）

见 `docs/prd/SOFT_NAV_AND_PRESETS.md`：

- 主栏：Explore · Create · Effects · Official Examples  
- 首页最多 **8** 个白名单 recipe  
- More 里 Preview/Local/Coming soon  

---

## 5. 上线门禁（共同）

`docs/prd/GO_NO_GO.md` — 公开 pikbo.ai 需 G1–G7。  
当前瓶颈：**G6** 真机 3 图 + 退分未满。

---

## 6. 研究分灶（避免重复劳动）

| 主题 | 主责 | 次责 |
|------|------|------|
| 竞品交互/增长/差异化 | **Grok** | GPT 读后写进 PRD |
| 产品合同/状态机/SEO 意图/验收 | **GPT** | Claude 可实现性反馈 |
| 实现差距/性能/前端交互可落地 | **Claude** | Grok 优先级 |
| 门禁与合流 | **Grok** | 全员 |

---

## 7. 开放问题（谁认领谁填）

| # | 问题 | 认领 | 状态 |
|---|------|------|------|
| Q1 | 首页 8 白名单片是否每张质量过关？ | Claude 检 + 老板眼 | open |
| Q2 | Seller Pack 三输出状态机与积分是否与 live API 一致？ | GPT 规格 + Claude 对代码 | open |
| Q3 | Yiha Create 登录后完整控件截图级流程 | 任 agent 补 `by-agent/*` | open |
| Q4 | HF Product Studio 内页逐步操作（需账号） | Grok/Claude 有账号再补 | open |

---

## 8. 变更记录

| 日期 | Agent | 变更 |
|------|-------|------|
| 2026-07-23 | Grok | 初建；并入 HF/Yiha 交互结论 |
| 2026-07-23 | GPT | WORLD_CLASS + SEO_50 + NAV 白名单入库 |
| 2026-07-23 | GPT | **研究完成**：`RETENTION_REMIX_LOOP.md`（HF/Yiha 实测 → Remix 合同）；Grok 标记 ✅ |
