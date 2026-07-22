# Pikbo SEO 作战手册（哥飞路径 × Ahrefs 基础 × 刘小排产品观）

> 给新手老板：先懂地图，再开第一站。  
> 资料来源：Ahrefs 公开 SEO 课、new.web.cafe 教程目录与公开镜像、刘小排公开方法论、本站代码现状。  
> **门禁：** 找词 → 判词 → 做页 → 上站 → 外链/GSC → 迭代。不要跳步。

---

## 0. 一句话总纲

| 来源 | 核心一句话 |
|---|---|
| **Ahrefs** | 90%+ 页面零流量；先找有人搜的词，再做匹配意图的页，再让 Google 能抓到，再靠链接与体验赢排名 |
| **哥飞** | 出海工具/内容站 = **挖需求 → 判能否做 → 做匹配意图的落地页/内页 → 上站 → 内链/外链 → 养站** |
| **刘小排** | 产品成功 = **什么人？什么场景？愿花多少钱？解决什么问题？** 产品先有用，再谈 SEO/增长 |

三者叠在一起：

```
真实需求(有人搜 + 愿付费) 
  → 关键词可做(难度/SERP/意图匹配) 
  → 页面真正解决问题(工具/内容) 
  → 技术可索引 + 内链外链 
  → 流量 → 转化 → 复利养站
```

---

## 1. Ahrefs 七章（必会地图，不背细节）

### 1.1 搜索引擎怎么工作
- 抓取 → 渲染 → 索引 → 算法排序  
- 关键信号：**反向链接、相关性、新鲜度、速度、移动友好**  
- AI 助手也常参考搜索索引 → **进 Google 索引 = 进 AI 可见的前提**

### 1.2 SEO 基础五步
1. 关键词研究  
2. 内容/工具创作  
3. 页面 SEO + 站内结构  
4. 外链与品牌提及  
5. 技术 SEO（可抓取、可索引、sitemap、HTTPS）

### 1.3 关键词
- **先有种子词** → 扩展 → **聚类（一个页面打一组近义词）**  
- 指标：搜索量、**流量潜力**、KD、CPC、趋势、**商业潜力**  
- 新手常错：只追大词；忽略长尾/零搜索量词的累积  
- 意图：信息 / 商业 / 交易 / 导航 —— **SERP 长什么样，你就做什么页**

### 1.4 页面 SEO（On-Page）
- 目标词进：**Title / H1 / URL / 首段 / 部分 H2**  
- 一个 H1；结构清晰；内链；图片 alt；FAQ/HowTo Schema  
- 元描述不是直接排名因子，但影响 CTR 与 AI 引用时的摘要

### 1.5 外链
- 四类：添加 / 请求 / 购买(风险) / 赢得  
- 新站先做**基础外链**；好链接 = 权威 + 相关 + 位置好  
- 可链接资产 + 内链把权重导向赚钱页

### 1.6 技术 SEO
- 优先：**索引检查 → 301 救死链 → 内链 → Schema**  
- 其余（CWV、插页等）重要但次于「内容 + 链接」  
- JS 重站注意：核心内容尽量 SSR（哥飞评站也反复强调）

---

## 2. 哥飞路径（按学习指南顺序）

### 2.1 学习顺序（跟他写的走）

1. Ahrefs 公开课（概念扫一遍）  
2. 进阶目录扫一眼（知道全景）  
3. **新手入门**系列  
4. **挖掘需求**  
5. **判断关键词是否可做**  
6. **上站之后做什么** + 排名机制  
7. **工具落地页设计**（V1→V1.5→V2）  
8. **精品工具站**思路  
9. **养网站防老**全流程  
10. 外链（博客评论等仍可用）  
11. 模拟器多玩几遍 → 实操

### 2.2 挖需求（找词）

| 方法 | 做法 |
|---|---|
| 财富密码后缀 | generator / maker / converter / online / free / tool / AI / downloader / checker… |
| 竞品拆解 | Ahrefs/Similarweb 看 Top Pages、Organic keywords |
| 大站缝隙 | 大站有流量的子页/角色词/长尾，自己单独做站或页 |
| 趋势新词 | Google Trends 看是否新词、是否上升 |
| 社区真实痛点 | Reddit / 论坛 / 群聊 / Vercel 子域名灵感 |
| 出站/入站 | 分析谁给 Gumroad/Stripe 带流量、出站链到哪 |

### 2.3 判词是否可做（核心技能）

**手动打开 Google 看 SERP（比任何 KD 分数重要）：**

- 首页是谁？大品牌 / 老站 / 新站 / 薄内容工具页？  
- 引用域名大概多少？DR 多高？  
- 是否已有「弱站」进前 10？（有 → 新站有机会）  
- 意图是工具、列表、教程还是电商？

**量化参考（哥飞公开公式）：**

```
KDROI ≈ (搜索量 × CPC) / 优化难度
```

- 高 KDROI = 更值得优先做  
- **CPC 看变现方式：** 卖广告重 CPC；卖订阅/工具重「是否解决痛点、是否愿付费」  
- **KGR 类思路：** 搜索量不大但索引竞争弱的长尾，新手优先

**新手第一站原则：**

- 先 **小词、明确意图、SERP 上有弱站**  
- 不做「AI video generator」这种巨兽词当唯一目标  
- 做 **长尾矩阵** 累积

### 2.4 落地页 / 精品工具页

哥飞反复强调的页面形态（与 Ahrefs On-Page 一致）：

1. **Hero 即工具**（上传/输入 → 一键出结果）——匹配「tool」意图  
2. Title / Description / H1 含主词  
3. 下方：怎么用 / 谁适合 / FAQ / 相关内链  
4. 内页集群：每个长尾词一页，互相内链  
5. 服务端可抓取正文（别全是客户端空壳）  
6. 版本：V1 能用 → V1.5 完善 SEO 文案与 FAQ → V2 差异化体验与转化

### 2.5 养网站防老流程（第 0–9 步压缩版）

0. 会做页（或用 AI 编程）  
1. 挖第 1 个需求  
1.5 公式/SERP 判词  
2. 分析搜索意图  
3–4. 生成 + 手调页面  
5. **内页 + 内链**  
6. 多语言（可选，刘小排 Raphael 案例：多语可开新流量池）  
7. 域名 + 部署  
8. **统计 + GSC + 外链 + 等收录**  
9. AI 内容要高质量、有用，非垃圾堆

### 2.6 上站之后

- GSC 提交 sitemap  
- 检查索引（Coverage / URL Inspection）  
- 基础外链 + 相关社区提及  
- 看 Search Console 查询词 → 扩写已有排名词  
- 迭代：更新内容 > 盲目加新站

### 2.7 外链（哥飞仍强调）

- 博客评论等**相关、自然**的基础外链仍有用  
- 不买垃圾链；优先相关站、可链接资产、PR/社区

---

## 3. 刘小排补充（产品 × 增长）

| 点 | 对你的意义 |
|---|---|
| **什么人 / 场景 / 愿付费 / 问题** | Pikbo = 潮玩收藏者/卖家；要 listing 视频 / TikTok；愿为 credits 付费 |
| **产品先有用** | SEO 不能救无用工具；Generate 真出片优先 |
| **多语言可扩 SEO 池** | 站稳英文后再考虑 es/ja 等（玩具全球收藏圈） |
| **增长可非 SEO** | Raphael 曾强产品传播；Pikbo 也可社区/样片/X 传播并行 |

**分工建议：**  
- 哥飞体系 → **流量结构**（词、页、站、链）  
- 刘小排体系 → **产品与付费理由**  
- Ahrefs → **通用 SEO 科学语言**

---

## 4. 应用到第一站：Pikbo（pikbo.ai）

### 4.1 产品定位（刘小排四问）

| 问 | 答 |
|---|---|
| 什么人 | 设计师玩具/盲盒收藏者、Etsy/Whatnot/TikTok Shop 卖家 |
| 场景 | 一张静态图 → 需要可发的短视频 |
| 愿付费 | 订阅 + credits（Creator/Shop） |
| 问题 | 不会拍、没时间拍、要 listing/货架/拆盒视频 |

### 4.2 关键词策略（哥飞判词 + Ahrefs 意图）

**不要主攻（新站过难）：**  
`ai video generator` / `text to video` / `runway` 级大词

**优先主词簇（商业潜力高 + 垂直）：**

| 类型 | 示例种子（需你用工具核搜索量/KD） |
|---|---|
| 核心工具 | designer toy video maker, figure spin video, blind box video maker |
| 场景长尾 | etsy listing video, tiktok shop product video, whatnot product video |
| 玩法 | 360 spin figure, unboxing video from photo, shelf flex video |
| How-to | how to make a figure spin video, photograph toys for ai video |
| 品类 | action figure video, plush toy video, art toy animation |

**站内已有 pSEO 骨架（很符合哥飞「内页」）：**

- `/effects/[slug]` ← presets  
- `/for/[slug]` ← use cases  
- `/toys/[slug]` ← toy types  
- `/guides/[slug]` ← how-to  

这是正确的 **精品工具站 + 内容内页** 结构。下一步是：**每个 slug 对准真实有搜索量的词，并强化落地页 V2**。

### 4.3 技术 SEO 现状（代码）

| 项 | 状态 | 动作 |
|---|---|---|
| sitemap.xml | ✅ 含 effects/for/toys/guides | 上线后 GSC 提交 |
| robots.txt | ✅ allow + sitemap | 确认生产域名 |
| metadataBase | ✅ site.url | 域名 DNS 必须指到真实站 |
| 主词 | site.keyword = designer toy video maker | 首页 Title/H1 对齐 |
| SSR | App Router 页面多为服务端/静态 | 保持落地文案 SSR |
| FAQ Schema | guides 有 JSON-LD 方向 | 扩展到 effects/for |
| 外链 | 0（新站） | 上线后基础外链包 |
| GSC | 未上线则无 | **上线日必做** |

### 4.4 落地页分级（哥飞 V1→V2）

| 页面 | 角色 | 优化重点 |
|---|---|---|
| `/` | 品牌 + 工具入口 | H1 含主词；样片；CTA → /create |
| `/create` | **核心工具页**（交易意图） | Title 含 maker；上方即上传；下方 FAQ |
| `/effects/*` | 长尾工具/效果 | 每页 1 主词；FAQ；链到 create?effect= |
| `/for/*` | 场景词（Etsy 等） | 商业意图文案 + CTA |
| `/guides/*` | 信息意图 | 获外链潜力；内链到工具 |
| `/pricing` | 转化 | 诚实定价（已对齐 480/720） |

### 4.5 第一站 14 天行动清单（按哥飞上站后逻辑）

**Day 0–1 上站门禁**

- [ ] 部署 Vercel + `pikbo.ai` DNS  
- [ ] `SESSION_SECRET` + `FAL_KEY`  
- [ ] 打开 GSC + Bing Webmaster，提交 `https://pikbo.ai/sitemap.xml`  
- [ ] Analytics（GA4 或 Plausible）

**Day 1–3 判词落地**

- [ ] 用 Ahrefs 免费 / Keywords Everywhere / GKP 核 20 个长尾词搜索量  
- [ ] 每个现有 slug 填「目标主词 + 2 个次词」表  
- [ ] 删/合并无搜索意图的弱页（宁少勿垃圾）

**Day 3–7 On-Page**

- [ ] 首页 + Create + 流量最大潜力的 5 个 effect 页：Title/H1/首段/FAQ  
- [ ] 每页 CTA → Generate，带 effect 参数  
- [ ] 内链：guides ↔ effects ↔ for ↔ toys

**Day 7–14 外链与内容**

- [ ] 基础外链：Product Hunt / 相关目录 / 社媒 bio  
- [ ] 潮玩 Reddit/Discord/论坛真诚发帖（非 spam）  
- [ ] 1–2 篇 guides 加深（可链接资产）  
- [ ] GSC 看首次收录与查询词

### 4.6 变现与 SEO 的关系

- 免费计划 = 漏斗顶（试用）  
- SEO 流量进 `/create` 与 `/for/*` 转化最高  
- 哥飞案例：流量 × 变现效率；Pikbo 是 **订阅工具** 不是纯 AdSense → 更要 **商业意图词**

### 4.7 明确不做（避免浪费）

- 不上线就狂堆 1000 篇 AI 垃圾文  
- 不买垃圾外链  
- 不跟 Kling/Runway 硬刚大词  
- 不在 Stripe 未稳前把「收费」当 SEO 目标（先收录与试用）

---

## 5. 你（老板）每周最小动作

1. **玩模拟器**（new.web.cafe 三个 SEO 模拟器）巩固判断  
2. **每周 3 个新长尾页** 或强化 3 个旧页  
3. **看一次 GSC** 查询词 → 扩写  
4. **社群/群聊** 问判词（哥飞路径强调多问多实践）  
5. 产品：保证 Generate 稳定出片（刘小排：产品有用）

---

## 6. 工具箱（够用即可）

| 用途 | 工具 |
|---|---|
| 概念 | Ahrefs 公开 SEO 课 |
| 找词 | Google 下拉、GKP、Ahrefs Free、Trends |
| 竞品 | site: 搜索、Ahrefs Site Explorer 试用、Similarweb |
| 上站后 | Google Search Console、Bing Webmaster |
| 页面检查 | 浏览器查看源码、Rich Results Test、PageSpeed |
| 社群 | new.web.cafe 教程/案例/群聊 |

---

## 7. 访问限制说明（研究诚实度）

- **Ahrefs 七篇正文**：已完整阅读提炼  
- **new.web.cafe 目录与系列结构**：已抓取；**部分 detail 正文需登录会话**，爬虫只能见标题  
- **公开镜像**（outseaweb 等）：KDROI、养站步骤、51 财富词、评站要点已并入  
- **刘小排**：公开方法论 + Raphael 多语案例；Idea to Business 付费课正文未登录则无法全文镜像  

若你需要「逐篇精读某篇小课堂全文」，请在已登录浏览器中打开该 URL，或把正文粘贴给我，我按原文再做批注版笔记。

---

## 8. 下一步（执行优先）

1. **你：** 决定是否本周上线 pikbo.ai（SEO 从 GSC 日开始计时）  
2. **我：** 按本手册做「关键词表 + 5 个页面 Title/H1/FAQ 改写 + Schema」代码 PR  
3. **共同：** 选 10 个长尾词做 Ahrefs/免费工具核验后写入 `docs/KEYWORD_MAP.md`

**记住哥飞节奏：上站，上站，多上站；但第一站要把词判对、页做对。**
