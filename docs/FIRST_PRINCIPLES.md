# Pikbo — 第一性原理 + 马斯克五步工作法

**状态：** 生效中（2026-07-23）  
**协调：** Grok  
**与地基关系：** 本文定义 *为什么* 与 *砍什么*；`FOUNDATION.md` 定义 *怎么做契约*。冲突时以本文为准删减需求。

---

## 0. 第一性原理（不靠类比）

类比思维：*「像 Higgsfield / 像 POP MART / 像完整 SaaS 套件。」*  
第一性原理：拆到物理与经济上不可再分的真，再往上搭。

### 0.1 物理真

| # | 真 | 推论 |
|---|----|------|
| P1 | 视频推理按秒计费（fal Seedance） | 免费无限 = 破产；「羊毛」只能是有限试玩 |
| P2 | 无身份时 cookie ≈ 假身份 | 清 cookie 可刷免费；不能当真付费账本 |
| P3 | 公网域名是分发的入口 | 本地 dev 对获客为 0；**上线 > 再装修** |
| P4 | 用户目标：玩具静图 → 可发短视频 | 主循环只有：上传 → 生成 → 下载/复制链接 |
| P5 | 演示片零边际成本 | Demo 可无限；Live 必须扣积分且诚实标注 |

### 0.2 产品真（一句话）

> **Pikbo = 手办/潮玩卖家与藏家，用一张图生成可上架/可发的短视频，并诚实付模型成本。**

不是：全能 AI 视频套件、假 UGC 社区、多模型商城、Cinema 影棚仿真。

### 0.3 唯一关键路径（Critical path）

```text
Home（证明会动） → Create（上传+效果） → 出片（demo|live） → Pricing（付费意图）
                     ↑ SEO: /effects /for /toys 只为喂这条路径
```

**不在关键路径上的，默认冻结或降级导航，不删路由（保留 SEO/深链）。**

---

## 1. 马斯克五步（严格执行顺序）

> 顺序反了 = 浪费。先问需求 → 再删 → 再简 → 再快 → **最后**自动化。

### Step 1 — 让需求不蠢（Make requirements less dumb）

| 蠢需求 | 更不蠢的需求 |
|--------|----------------|
| 做成 Higgsfield 全套壳 | 关键路径 4 步可用 + 潮玩语气 |
| 多模型 Kling/Veo/Sora 并列 | 一条 Seedance 水管诚实出片 |
| 先 Stripe 收钱 | 先公网 soft launch + 免费试玩；**durable credits 后再真收钱** |
| 三 agent 不停堆页 | 地基已齐则停堆；只修关键路径 |
| 免费 3～50 次 live | **~1 次 Mini 480p 水印试玩**（单位经济） |
| 完美 Library 云端 | localStorage 够 soft launch |
| 先做社区/Cinema/Apps | 出片稳 + 域名通之后再说 |

**老板可改的需求只有：** 是否部署、是否充 fal、是否开 Stripe。  
**代码侧不可再假装：** 假 live、假无限、假 1080p。

### Step 2 — 删除（Delete）

能删的过程 / 表面，先删导航权重（路由可留）：

| 删/降级 | 原因 |
|---------|------|
| 侧栏主推 Cinema / Apps / Models / Community | 不完成 P4；制造「假完整套件」预期 |
| 新开 HF 大装修 / 大重写分支合流 | 破坏地基；加速假象 |
| 「再堆 Explore 战役条」 | 不增加出片成功率 |
| Stripe 生产收费（暂禁） | P2 未解 = 账本不可信 |
| 多 agent 无 DISPATCH 的并行改 API | 冲突成本 > 收益 |

**规则：** 若你删完后觉得 *一点都没想加回来*，说明删得还不够。  
本轮：主 nav 只留关键路径；次要入口进「More」或 Footer。

### Step 3 — 简化与优化（Simplify — only after delete）

| 项 | 简化后 |
|----|--------|
| 模型 | Free → Mini 480p；Paid → Full/Fast 720p |
| 积分 | 10 分/片；Free 10 / Creator 50 / Shop 150 |
| 生成契约 | 永远 `{ videoUrl, demo, watermark, model, session, ... }` |
| 文案 | 一处 `lib/pricing.ts`；UI 不得另起炉灶 |
| 身份 | soft cookie 直到 T5 auth |

### Step 4 — 加速循环（Accelerate cycle time）

| 循环 | 目标时长 |
|------|----------|
| 改契约 → preflight 绿 | < 5 min |
| 本机 upload → 出片 | Mini ~1–2 min（依赖 fal） |
| 老板部署（LAUNCH.md） | 30–60 min 一次性 |
| 发现假文案 → 修 | 当天，不攒 sprint |

**禁止** 用「再开一个大功能」假装加速。  
真正的加速瓶颈现在是：**公网部署 + 域名**，不是再写组件。

### Step 5 — 自动化（Automate last）

**现在不要做：** 复杂 agent 编排、自动充值、自动发推。  
**现在可以做：** `preflight`、health、critical-path smoke、（可选）CI build。  
**以后做：** 部署后 uptime、Stripe webhook 监控、额度告警。

---

## 2. 当前真相（相对五步的位置）

| 层 | 状态 |
|----|------|
| 需求（Step 1） | 地基已对齐；本文件冻结蠢需求 |
| 删除（Step 2） | **进行中** — 导航降级非关键路径 |
| 简化（Step 3） | 大体完成（contracts / pricing / Mini free） |
| 加速（Step 4） | 本机 live ✅；**公网未通 = 最大阻塞** |
| 自动化（Step 5） | preflight 有；CI 次要 |

---

## 3. 落实清单（按五步排期，不并行乱加）

### 本周只做（P0）

1. **导航 / 心智删减** — 主路径可见；套件页降级  
2. **文案真相** — Free = Mini，不是「Fast 无限」  
3. **critical-path smoke** — `/` · `/create` · `/api/health` · `/pricing`  
4. **老板：LAUNCH.md** — Vercel + `SESSION_SECRET` + `FAL_KEY` + 域名  
5. **验收 5 条**（见 SPRINT_24H / LAUNCH）

### 明确不做（直到 P0 完成）

- 新表面模块、假社区内容、多模型 UI  
- 生产 Stripe 收款（等 T5 durable credits）  
- ffmpeg 硬水印可排 P1，不挡 soft launch（文案写清 on-player）

### P1（soft launch 之后）

- T5 身份 + 持久积分  
- 服务端水印  
- 限流 / 防刷  
- 真 UGC（有存储后）

---

## 4. 决策测试（每加一行代码先问）

1. **这是需求还是虚荣？**（Step 1）  
2. **能删掉整块吗？**（Step 2）  
3. **删完后还能再简 30% 吗？**（Step 3）  
4. **这让用户更快看到片，还是让我们更快感觉在忙？**（Step 4）  
5. **若自动化，是否已手工跑通 10 次？**（Step 5）

任一答不上来 → 不写代码。

---

## 5. 与三 agent 的约束

| Agent | 允许 | 禁止 |
|-------|------|------|
| Grok | L0–L3、合流、关键路径、删减 | 为 HF 对标再扩壳 |
| Codex/GPT | 定价/转化文案对齐 `pricing.ts` | 改 generate 契约、假数字 |
| Claude | preset/for/toys FAQ 质量 | 新大页、套件扩容 |

---

## 6. 一句话作战令

> **物理学只要求：图进、片出、成本盖得住、人在公网找得到。  
> 其余先删。删完再简。简完再快。快了再自动。**
