# 竞品产品交互能力深解 · Higgsfield + Yiha

**日期：** 2026-07-23  
**对象：** [higgsfield.ai](https://higgsfield.ai/) · [yiha.ai](https://yiha.ai/)  
**目的：** 先彻底明白 **他们产品在干什么、用户怎么操作**，再决定 Pikbo 怎么干。  
**边界：** 只学交互与产品形态；不抄 logo/文案/片源。

---

## 0. 一句话定性

| 产品 | 本质 | 不是 |
|------|------|------|
| **Higgsfield** | **AI 创意生产操作系统**：多模型推理 + 预设/App 货架 + 社区作品 + 云 Library + 积分订阅 | 不是单一「图生视频页」 |
| **Yiha** | **多模态创作工作台**（法务主体 ReelMind）：Video/Image/Edit/Music 工具货架 + Create（模型+提示+参考）+ 会员积分 | 不是潮玩垂直站；是通用 creator 平台 |

**共同商业逻辑：**  
进站就 **能点作品 / 能开 Create** → 烧 credits → 为模型质量与配额付费 → Library/账号锁住资产 → 社区/Explore 拉回访。

---

## 1. Higgsfield：他们到底在做什么

### 1.1 产品分层（交互视角）

```text
┌─────────────────────────────────────────────────────────┐
│  L0  壳：Home · Community · Generate · Library · Profile │
├─────────────────────────────────────────────────────────┤
│  L1  发现：Explore 满屏可播媒体 + 新品战役 + 模型入口卡   │
│  L2  一键形态：Viral Presets / Apps 微工具               │
│  L3  主工作台：/ai/video · /flow · Marketing Studio      │
│  L4  专业工作台：Cinema Studio（角色/场景/镜头/协作）     │
│  L5  代理层：Supercomputer / MCP / Agent 自动化          │
│  L6  资产与账号：Library · Project · Elements · Credits  │
└─────────────────────────────────────────────────────────┘
```

他们卖的不是「一个 API 按钮」，是 **从发现 → 一键出片 → 专业导戏 → 批量/代理** 的整条生产链。

### 1.2 核心交互回路（用户每天怎么用）

| 回路 | 用户动作 | 系统反馈 | 为什么赚钱 |
|------|----------|----------|------------|
| **发现→重做** | 在首页/社区看片 → 点进 project/preset | 看到 prompt/资产/模型 → Remake/Generate | 降低创作启动成本 |
| **一键病毒** | Viral Presets 墙点一个名（如 BASEBALL GAME） | 进 Generate，配方已绑好 | 会话深度 + 分享 |
| **通用生成** | Flow / Create Video：上传或文本 + 选模型 + 参数 | 出片进 Library | 主 ARPU |
| **商品片** | Product Video：商品图/链接 → 360/演示/广告 | 可卖可投的片 | **电商预算**（与我们最近） |
| **导戏** | Cinema：角色+场景+镜头+类型+Mr.Higgs | 多镜头一致性 | 高阶付费 |
| **批量** | Supercomputer / batch apps | 多任务队列 | Shop 级用量 |
| **资产** | Library / Profile / Elements | 云端历史、角色可复用 | 留存与续费 |

### 1.3 Generate 工作台在交互上「硬」在哪

从 [Create Video](https://higgsfield.ai/ai/video)、[Flow](https://higgsfield.ai/flow)、公开评测与站内文案综合：

1. **模式入口清晰**：Image / Video / Edit / Characters / Models 分轨（Flow），不是一个混乱表单。  
2. **输入多样**：文本、图、音、参考、多参考；商品场景还有 **store link**。  
3. **模型是一等公民**：Kling / Sora / Veo / Seedance / WAN… **可切换对比**，一订阅多模型。  
4. **参数是生产语言**：时长、画幅、镜头运动、镜头/景深（Cinema），不是工程师堆砌。  
5. **预设 = 可执行配方**：一点 preset → 参数+叙事结构灌好，不是只有名字的空卡片。  
6. **结果可进资产体系**：Library、Project、可公开、可被别人学。  
7. **Assist**：prompt 增强 / Mr.Higgs 拆镜头，减少试错烧分。

### 1.4 Cinema Studio 3.5（专业层，不是我们现在该抄全的）

公开能力：

- **Elements**：角色 / 地点 / 道具 一次建、`@` 引用、跨镜头一致  
- **Genre / Style / Camera** 面板（Action、Orange Teal、Zoom In…）  
- **实时协作** 同项目  
- **Mr. Higgs** 自然语言 → 分镜与参数  
- **调色 / 灯光** 与场景联动再生  

**对我们的含义：** 学的是「**一致性资产 + 导演语言**」；不是立刻做整套影棚。潮玩版 Elements = **同一玩具身份锁**。

### 1.5 Product / Marketing Studio（与潮玩最同构）

[AI Product Video Generator](https://higgsfield.ai/ai-product-video-generator) 明示的 **job**：

| 能力 | 用户得到 |
|------|----------|
| 商品图 → 动态 | 无拍摄 |
| 360 spin | 上架/PDP |
| Demo / unbox | 功能演示 |
| Lifestyle scene | 场景植入 |
| Spokesperson + lipsync | UGC 感广告 |
| Voiceover + captions | 多语言分发 |
| Batch + resize | 全渠道规格 |
| 多模型同工作区 | 选最好一条 |

**三步交互他们写死了：**  
Upload product → Direct shot → Export & sell。

**这才是 HF 里「卖货视频」那条腿。** Pikbo 应 **垂直吃死这一腿的潮玩子集**，而不是假装做完整 Cinema。

### 1.6 首页在交互上验证了什么

| 模块 | 交互承诺 |
|------|----------|
| 可播视频墙 | 「结果优先」——先信再点 |
| 模型/App 卡 | 一点进 **对应工具**，不是博客 |
| Community projects | 真作者、Public、可看穿 prompt/资产 |
| Viral Presets | 口语化命名 + 独立片 + View all |
| 旗舰战役（Seedance 4K 等） | 单一模型全幅 Try |
| 底栏 Generate | 永远一键进工作台 |

### 1.7 HF 明确不靠什么

- 不靠长文介绍公司  
- 不靠「Coming soon」空门当主路径  
- 不靠一张 demo 刷 20 个预设名  

---

## 2. Yiha：他们到底在做什么

### 2.1 身份与形态

- 品牌站：Yiha AI Video Generator / Image Tools / Creator Platform  
- 法务条款主体：**ReelMind（XIENX INC）** — 通用 AI 媒体平台  
- 能力声明：T2V / I2V / V2V / T2I / 图编辑 / 音频 / **模型浏览与定价** / 工作区 / 社区发布 / **积分会员** / API  

### 2.2 信息架构（实测导航）

顶栏工具货架（mega menu）：

| 入口 | 角色 |
|------|------|
| **Explore** | 趋势作品与可 remix 灵感（[explore](https://yiha.ai/explore)） |
| **Video** | 视频生成主轨 |
| **Image** | 静图 |
| **Edit** | 编辑轨 |
| **Lab** | 实验/实验室向 |
| **Music** | 音频 |
| **Mooca / KOL / Nolanx** | 品牌化子产品/场景 |
| **Pricing / Membership** | 积分与套餐 |
| **Sign In** | 登录后进深能力 |
| **Create** | 中心工作台（[create](https://yiha.ai/create)） |

另有子应用：`/apps/ai-stylist`、`/lego`、`/experiment` 等 — **App 货架** 思路与 HF Apps 同族。

### 2.3 Create 工作台（从 title/meta/页面关键字推断 + 条款）

Create 页自我定义：

> *Create AI videos with **models, prompts, and references***  
> *…advanced models, and **fast generation controls** for creators and production teams.*

页面/包内可见能力信号：

- **Model** 选择（页面出现 Kling / Seedance / Sora / Flux 等模型名）  
- **Prompt**  
- **Reference / Upload**  
- **Duration / Aspect**  
- **Motion / Style**  
- **Batch**  
- **Credit** 计量  
- **Library / History**  

**交互骨架 = 标准「模型货架型 Create」：**

```text
选模型 → 上传参考（可选）→ 写/改 prompt → 调画幅时长 → 扣 credits 生成 → 进 History
```

与 HF 比：Yiha 更偏 **工具货架 + 模型超市**；HF 更偏 **发现社区 + 预设病毒 + 专业影棚 + 商品工作室** 更重。

### 2.4 会员与积分交互

[Membership](https://yiha.ai/membership)：

- 对比 **credits、premium models、faster generation**  
- **Credit packages**：公开 **1 USD = 100 credits**  
- **Credits never expire**（买量包）  
- 交易历史  

条款补充：任务提交扣分、会员分可周期重置、促销分可过期、失败/主观不满意默认不退款（技术故障可补分）。

### 2.5 Explore 交互

> 发现趋势视频/图实验/创作者作品 → **remix prompts/styles**

即：**灵感墙 → 带回 Create 再生成**（与 HF community remake 同族）。

### 2.6 Yiha 对 Pikbo 的可学 / 不可学

| 学 | 不学 |
|----|------|
| 顶栏 **清晰模态**：Video / Image / Edit | 一堆与潮玩无关的子品牌（Music/KOL…）先堆满 |
| Create = **模型+参考+参数** 一体 | 假多模型无 key |
| Membership **积分算术透明** | 复杂子产品线 |
| Explore → remix | 空 Explore |

---

## 3. 两边对照：交互能力矩阵

| 能力 | Higgsfield | Yiha | Pikbo 现状 | 潮玩该怎么做 |
|------|------------|------|-----------|--------------|
| 进站即 App | 强 | 强 | 中强 | 保持 App 壳 |
| 满屏可播证明 | 极强（真 UGC） | Explore 有 | 官方 demo | 真片+以后 UGC |
| 一键预设/配方 | Viral Presets 极强 | 弱于 HF | 有 recipes | **死磕玩具配方质量** |
| 图→视频主台 | 强 | 强 | 有 Create | 继续打磨旗舰 |
| 文→视频 | 有 | 有 | soon | 可后做 |
| 多模型货架 | 核心 | 核心 | 单 Seedance 诚实 | **不装**；以后真接再上 |
| 商品 360/上架 | Marketing Studio 强 | 弱/泛 | Seller Pack MVP | **主战场** |
| 角色/一致性 | Elements 强 | 中 | prompt 锁 | **玩具身份锁升级** |
| 社区 remake | 强 | Explore remix | 弱 | soft 后 |
| 云 Library | 强 | History | 本机 | 付费前可忍 |
| 积分订阅 | 强 | 强透明 | Coming soon | T5 后再真收 |
| Agent/批量 | Supercomputer | Batch 信号 | 薄 | Seller 三件套优先 |
| 影棚导戏 | Cinema 极强 | 弱 | 空壳勿装 | **不做假 Cinema** |

---

## 4. 真正要抄的「交互原则」（不是抄菜单名）

### P1 · 结果先于配置

用户先 **看到能动的结果**，再进工作台。HF/Yiha 都是媒体驱动，不是文档驱动。

### P2 · 一键 = 完整配方

Preset 必须带走：**模型或模型档、时长、画幅、prompt 骨架、镜头语言**。  
空名字 + 共用片 = 反交互。

### P3 · 工作台「输入→参数→生成→资产」闭环

Create 结束必须 **结果可存、可下、可再生成**。  
HF Library / Yiha History 都是闭环；localStorage 只是 soft 替身。

### P4 · 工具货架服务 job，不是装公司

HF 的 Product Video、Yiha 的 Video/Image 分轨，都是 **job 分型**。  
Pikbo job 只有一个主：**自有潮玩静图 → 可发可卖短视频**。  
副 job：Seller 三件套。其余门面砍掉。

### P5 · 发现与生产同一产品

Explore/Community 不是营销站；是 **生产漏斗上口**。  
点作品 → 带参数进 Create。

### P6 · 积分是交互的一部分

生成按钮上的 **成本可见**、失败策略、套餐对比，都是交互。  
「Coming soon」只能是阶段诚实，不能是永久无经济系统。

---

## 5. 对 Pikbo 的结论：我们该做什么 / 不做什么

### 5.1 他们在做的（我们要理解）

- HF：做 **全品类 AI 内容工厂**（社区 + 多模型 + 影棚 + 商品 + 代理）。  
- Yiha：做 **多模态模型工作台 + 积分会员**。  
- 两边都在抢：**创作者日活 + 每次生成的 credits**。

### 5.2 我们不该做的

- 复制 HF 整站 Cinema/MCP/Original Series 空壳。  
- 复制 Yiha 全模态 Music/KOL 货架。  
- 用导航数量假装「像他们」。

### 5.3 我们该做的（潮玩垂直 OS）

| 优先级 | 交互能力 | 对标来源 |
|--------|----------|----------|
| **P0** | **商品/玩具图 → 配方 → 出片 → 下载** 极致顺滑 | HF Product 三步 + Yiha Create |
| **P0** | **配方墙一点即带参 Generate**（独立真片） | HF Viral Presets |
| **P0** | **Seller 三件套**（转台/拆盒/社媒）像 HF product apps | HF Marketing Studio 子集 |
| **P1** | Explore：点 demo → remake 同参 | HF project / Yiha Explore |
| **P1** | 结果 **History/Library** 可回看 | 两边 Library |
| **P1** | 玩具 **Identity 一致**（Elements 精简版） | HF Elements |
| **P2** | 真 UGC 社区 | HF Community |
| **P2** | 真多模型 | 两边货架（有 key 再上） |
| **永不假做** | Cinema 全套、无限模型、假社区数字 | — |

### 5.4 产品一句话（对齐竞品理解后）

> **Higgsfield/Yiha 证明：用户要的是「创作 App 闭环」。**  
> **Pikbo 要在同一闭环里，只做「潮玩/卖家」这一刀，做到比他们通用站更深。**

---

## 6. 给工程/产品的下一刀（基于本理解）

1. **Create 对齐「生产台」**：输入区、配方区、参数区、结果区四段清晰（HF/Yiha 同构）。  
2. **Preset 卡片 = 可执行链接**：`/create?effect=&…` 必须预填全。  
3. **Seller Pack** 按 HF product 三步文案与流程做实，不是入口广告。  
4. **禁止** 再开空 Cinema/Models 主路径。  
5. GPT：用本文更新 `WORLD_CLASS` / Seller 规格中的交互状态机。  
6. Claude：Create + Seller 交互按本文 P0 实现。

---

## 7. 来源（本次抓取）

- https://higgsfield.ai/  
- https://higgsfield.ai/flow  
- https://higgsfield.ai/cinematic-video-generator  
- https://higgsfield.ai/ai-product-video-generator  
- https://higgsfield.ai/ai/video  
- https://yiha.ai/ · /create · /explore · /membership · /terms（ReelMind）  
- 仓库既有：`docs/COMPETITOR_SITE_PATTERNS.md` · `docs/COMPETITOR_SPEC.md`

*Grok · 竞品交互研究 · 先理解再施工*
