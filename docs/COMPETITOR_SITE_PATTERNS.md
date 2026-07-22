# 竞品站 = 市场验证过的产品形态（优先于理论）

> 2026-07-23 · 原则：X/建站大神观点可吸收，但**拍板以已有流量与付费的竞品站为准**。  
> 主对照：**Higgsfield.ai**（创意套件、日级生成量级宣称、credits 商业化）  
> 辅对照：Runway（品牌/企业叙事，**首页形态不同**，别整站照抄）  
> 次要：Yiha 等 tool-shelf（抓取不稳定时以仓库 `COMPETITOR_SPEC.md` 为准）

---

## 0. 为什么听竞品站，不先听「大神观点」

| 来源 | 验证什么 | 用法 |
|------|----------|------|
| **竞品站模块** | 用户真的会点、会生成、会续费 | **主课表**：模块-for-模块对齐 |
| 哥飞/SEO | 冷流量怎么进来 | 工具内页、关键词，不改套件壳 |
| Namya/CRO | 文案清晰度 | 在竞品结构上补 ICP 句子 |

竞品活着说明：**「进站就是 App + 满屏可点视频/预设 + 一条 Generate」** 已经被市场买账。  
Pikbo 的任务是 **同构 + 潮玩垂直**，不是另造一套「理论上更清晰的营销站」。

---

## 1. Higgsfield 首页：市场验证过的结构（抓站摘要）

实测 [higgsfield.ai](https://higgsfield.ai/)（2026-07）：

### 1.1 不是「公司介绍站」，是 **Explore 型产品首页**

| 模块（自上而下） | 市场在验证什么 | Pikbo 对应 |
|------------------|----------------|------------|
| **促销/新品视频卡横滑** | Supercomputer free、Academy、插件、大赛、$ 激励 | 我们可用：Batch free 提示、Contest 以后再上；**先做「可点的新品轨」** |
| **Model / App 快捷入口** | Seedance、Cinema、Nano Banana、MCP… 一卡一工具 | `/models` + `/apps` + suite rail — **要更深、更新、更「点进就生成」** |
| **Community projects「看穿项目」** | 真用户作品 + 作者 + Public；可学 prompts/资产 | 我们只有官方 demo — **最大信任/留存缺口** |
| **旗舰模型大战役（Seedance 4K 等）** | 单一模型全幅广告位 + Try now + community of that model | 我们有 Seedance 但 **缺「单一英雄模型战役页」** |
| **Original Series / 内容 IP** | 自有内容喂养品牌与回访 | P2：潮玩短剧/unbox series 以后 |
| **Viral Presets 墙** | 命名口语化（BASEBALL GAME…）、每卡即效果、作者角标、View all | `/effects` — **要更多命名病毒感 + 创作者角标（可先 Official）** |
| **Supercomputer / Agent 横幅** | 高阶付费与自动化入口 | `/supercomputer` 已有壳，**叙事要更「一整层能力」** |
| **底栏 App chrome** | Home · Community · **Generate** · Library · Profile | AppShell — 已对齐思路 |

Schema/公开描述还强调：**多模型货架、credits、社区、日生成量**（市场用规模话术建立信任）。

### 1.2 导航与金钱路径（已验证）

- 底/侧：**Generate 是中心动词**，不是「了解更多」  
- 有 **Library / Profile**（账号与资产，支撑续费）  
- **Pricing / Enterprise / Team / Apps / Community** 在站内图谱里（套件可发现）  
- 免费钩子：**Free Mode / Learn free / Try now** 反复出现  

### 1.3 明确「不要抄」

- Logo、文案原句、官方成片、视觉资产  
- 假多模型（无 key 不写 live）  
- 日生成量等**未核实数字**不要瞎编；用自己的真实免费额度话术  

---

## 2. Runway：同一赛道、不同验证形态

[runwayml.com](https://runwayml.com/) 验证的是：

- **品牌 + 研究 + Enterprise** 叙事  
- 「Try free」进 **app.runwayml.com**（站与 App 分离）  
- 客户 logo / 案例 / 研究论文驱动信任  
- **50m+ creatives** 级社会证明  

**对 Pikbo 的含义：**

- 早期 **不要学 Runway 做研究公司首页**  
- 学他们的是：**Try free 直达工具**、以后有客户再堆 logo  
- 日用增长形态仍以 **HF 类 Explore App** 为主（老板已定 COMPETITOR_SPEC）

---

## 3. 竞品验证 → Pikbo 差距（按赚钱相关排序）

| # | 竞品已验证 | Pikbo 现状 | 对赚钱/流量的影响 | 优先级 |
|---|------------|------------|-------------------|--------|
| 1 | 进站即 **可点视频/预设 → Generate** | 有，继续加密 | 试用转化 | 保持+打磨 |
| 2 | **Community 真项目**（可抄 prompt） | 官方 demo 墙 | 信任、SEO UGC、回访 | **P0** |
| 3 | **Viral presets 海量命名 + 角标** | 有墙，命名/密度弱于 HF | 病毒分享与会话时长 | **P0** |
| 4 | **模型/App 货架「一点即用」** | suite rail + stubs | ARPU（多工具） | P1 |
| 5 | **旗舰模型战役页**（Seedance 专页） | 散落在 models | 付费升级叙事 | P1 |
| 6 | Free / credits / Profile 闭环 | Guest credits，无真账号 | **卡 Stripe 前必须** | P0 产品 |
| 7 | Academy / 教程 | guides 有，弱 | 降低流失 | P2 |
| 8 | Contest / 活动 | 无 | 爆发增长 | P2 |
| 9 | 规模数字社证 | 无（诚实不编） | 信任 | 用「free clips left」替代 |
| 10 | 垂直 ICP 文案 | 潮玩有 tagline | SEO 冷流量 | 吸收大神，**不压过 App 壳** |

---

## 4. 决策规则（写进团队习惯）

1. **新模块争议**：先问 *「HF/同类赚钱站有没有这个模块？」*  
   - 有 → 默认做，再潮玩化  
   - 无 → 标实验，别挡主路径  
2. **文案争议**：竞品结构优先；句子可参考 Namya/哥飞，**不改成营销博客**  
3. **SEO**：哥飞工具页挂在 **effects/for 内页**；首页继续 Explore App  
4. **诚实边界**：竞品有 Kling/Sora 货架 → 我们 **货架可展示 soon**，live 只接真 key  

---

## 5. 建议下一轮实现（只做市场验证过的）

### P0（对齐 HF 已验证）

1. **Community 项目感**：每条 demo 显示「作者/Official + remake」；布局更像 project card 而非纯 preset  
2. **Viral preset 命名与密度**：口语化短名、角标、View all 更重  
3. **Generate 中心路径**：任何视频卡 → 带 preset 进 create（已有则测摩擦）  
4. **账号/额度闭环**（产品）：否则定价页是假转化  

### P1

5. Seedance **战役条**（大横幅 + Try + 样例墙）  
6. Apps/Models **一点进工具**（减少 stub 死链）  
7. Pricing 从 chrome 更可发现（HF 有独立 pricing 路由）

### P2

8. Academy/教程轨  
9. 活动/contest  
10. 真 UGC 上传  

---

## 6. 与 `site-critique` skill 的关系

- **主镜头**：本文件 + `COMPETITOR_SPEC.md` + 实站  
- **辅镜头**：哥飞/Namya（补 SEO 与句子，不推翻竞品信息架构）  

Skill 已改为 **竞品优先**（见 `.grok/skills/site-critique/SKILL.md`）。
