# 全球建站/产品顶级视角 · 硬审 Pikbo（本机，不公网）

**日期：** 2026-07-23  
**对象：** `localhost:3000` · mode=`live-generate` · Stripe off  
**方法：** 不是「请真人付费坐诊」——世界上没有一键召唤顶级建站人的 API。  
下面是用 **被市场验证的标准 + 这些人公开方法论** 对照你们实站做的 **毒舌审**。  
证据来自：本机 HTTP 抓页、路由探测、资源复用统计、对标 [higgsfield.ai](https://higgsfield.ai)。

---

## 0. 请来的「陪审团」（标准来源，不是客服话术）

| 席位 | 代表谁 | 他们在世界上为什么算「会建站/会产品」 | 审什么 |
|------|--------|--------------------------------------|--------|
| **市场验证产品壳** | Higgsfield 级 AI 创作套件 | 日均海量生成、真 UGC、真模型货架 | 信息架构是否赚钱形态 |
| **出海 SEO / 工具站** | 哥飞 @gefei55 系 | 工具站内页矩阵、判词、一页完成工作 | 内页是否能接冷流量 |
| **SaaS 转化** | Namya / Supafast 系 | 高转化 AI SaaS 落地结构 | 5 秒内谁/问题/结果 |
| **AIDA / 落地页结构** | Oliver Kenyon 等 CRO | 注意力→转化漏斗 | CTA / 证明 / 欲望 |
| **工程诚实度** | 预发审计 + Lighthouse | 不骗用户、不空壳导航 | 假门、性能、PRD 缺口 |

**总判决（一句）：**  
你们做的不是「完全不能用的垃圾」——水管能通；  
但以「最会做站的人」标准看，**现在是 HF 的皮 + 潮玩话术 + 严重资产复用 + 多扇空门**。  
外人 10 秒会感觉：**像套壳，不像值得信的垂直产品。**

---

## 1. 总评分（满分 10，按席位）

| 席位 | 分 | 一句话 |
|------|----|--------|
| HF 级产品形态 | **4.5** | 导航像套件，内容像 demo 墙 |
| 哥飞 SEO | **3.5** | `/for/*` 404；工程口吻 meta |
| Namya 转化 | **4** | 有 CTA，缺「一眼懂为谁」 |
| CRO / 信任 | **3** | Lab 假社区感；Concept 共用片 |
| 工程诚实 soft | **6.5** | Coming soon / live-generate 还算诚实 |
| 性能（本地 LH） | **4** | SEO 100；Performance 58 · LCP 8.8s |
| **综合（可邀请外人）** | **4/10** | **不要装成已完成产品；当 alpha 工具壳** |

---

## 2. 毒舌清单（P0 = 最会建站的人会当场翻桌）

### P0-1 · 「空门导航」——最刺眼的垃圾感

顶栏现有：

`Explore · Image · Video · Cinema Studio · Presets · Models · Batch · PIKBO Lab · Feed · Library · Pricing · Generate`

| 路由 | HTTP | 问题 |
|------|------|------|
| `/models` | 200 | 文案含 **Soon** — 货架空 |
| `/for/etsy-sellers` 等 | **404** | 页脚/增长链外链 **断** |
| `/cinema` `/supercomputer` `/image` | 200 | 体量远小于 Create；**像门面** |

**专家会说：**  
> 不会做站的人用导航装公司；会做站的人 **砍到 4 个真入口**。  
> soft 期正确导航：**Explore · Create · Lab · Pricing**。其余隐藏或进「More」。

### P0-2 · 预设墙「共用片」——假丰富

首页视频资源复用（本机统计）：

| 资源 | 出现次数级 |
|------|-----------|
| `beatbot-neon.mp4` | **14** |
| `orbit-dance` / `orbit-aura` / `moon-smoke` / `moon-glow` | **各 ~12** |
| 大量 tile 标 **「Concept · shared loop」** | 诚实标签救不了观感 |

**专家会说：**  
> 20 个名字、5 个底片 = 用户一眼识破「填格子」。  
> HF Viral Presets 是 **每预设独立高质量片** + 创作者署名。  
> **要么砍到 6–8 个真片预设，要么补真片。假密度比稀疏更恶心。**

### P0-3 · 「社区」不是社区

- Lab / Feed 是 **官方 demo 循环**，不是用户 project。  
- HF：真实用户名、Public project、可进作品看资产。  

**专家会说：** soft 期应改名 **「Demo Lab / Official samples」**，别叫 Community 装热闹。

### P0-4 · 转化文案是工程师写的

首页/SEO description 仍像：

> *Seedance-ready … when live generation is enabled*

**哥飞 / Namya 会说：**  
冷用户不在乎 Seedance。他们要：  
> **「一张你自己的潮玩照片 → 5 秒可发 TikTok/Etsy 的片，免费用一次」**

现在半套件、半文档，**谁的问题一秒说不清**。

### P0-5 · 性能像没压过媒资

本地 Lighthouse：Performance **58**，LCP **~8.8s**，unused JS ~334KB。  
视频墙 `preload=auto` 多实例 → 会做站的人会先 **poster + 视口内再播 + 限同时播 1–2 路**。

### P0-6 · SEO 内页承诺落空

页脚吹 Etsy / TikTok Shop 等，**`/for/etsy-sellers` = 404**。  
哥飞铁律：内页能完成工作；你们是 **外链坟墓**。

---

## 3. 对标记分卡（vs Higgsfield 已验证形态）

| 模块 | HF | Pikbo | 差距 | 优先级 |
|------|----|-------|------|--------|
| 满屏可播证明 | 真 UGC + 官方大片 | 官方 demo + 大量复用 | 假密度 | **P0** |
| 一点 Generate | 强 | 强 | OK | — |
| 预设墙 | 独立片 + 署名 | 共用 loop + Concept | **致命** | **P0** |
| 模型/App 货架 | 30+ 真可用 | Models Soon / 单 Seedance | 装货架 | **P0 砍** |
| 社区 projects | 真用户 | Lab demo | 假 | **P0 改名** |
| Library | 云 | 本机 | soft 可忍 | P1 文案 |
| Pricing 诚实 | 可付 | Coming soon 诚实 | soft 正确 | — |
| SEO 垂直页 | 中 | for/* 404 | 断链 | **P0** |
| 垂直定位潮玩 | 无 | 有话术 | **唯一真差异** | 保住并做实 |

---

## 4. 他们会认可的（别全盘否定）

1. **真 live 水管**（health: `live-generate` + FAL）— soft 有资格试。  
2. **付费 Coming soon** — 不骗卡。  
3. **Cached demo / 所有权勾选** — 诚实方向对。  
4. **潮玩 ICP** — 比又一个通用 AI video 有存活点。  
5. **技术 SEO 基础** — LH SEO/a11y/best-practices 100（本机）。

这些是 **地基**，不是 **成品感**。

---

## 5. 72 小时「别再像垃圾」手术单（可执行）

### Day A — 砍空门（Claude）

- 顶栏只留：**Explore · Create · Effects · Lab · Pricing · Generate**  
- `Models / Cinema / Batch / Feed` soft 期进 overflow 或标注 **Preview**，禁止装完整产品。  
- 修 **所有页脚 `/for/*` 404**（有页就上，没页就删链接）。

### Day B — 假密度（Claude + 资产）

- 首页/Effects **最多 8 个主推预设**，**一预设一片**，去掉 shared loop 墙。  
- 其余 presets 列表文字入口即可。  
- Lab 文案：**Official demos**，禁 Community 暗示 UGC。

### Day C — 转化一句 + 性能（Grok 文案 / Claude 实现）

- 首屏固定一句 ICP（英文）：  
  **One photo of a toy you own → a 5s clip for TikTok / Etsy. Free Mini trial. No card.**  
- 视频：默认 `preload=metadata`，仅视口内 autoplay，同时 ≤2。  
- meta description 去掉 “when live generation is enabled” 工程腔。

### 手测（老板 / 任一 agent）

- 3 张真玩具图 live 出片 + 失败退分 — **没跑完不许说产品成了。**

---

## 6. 直接回答老板

**「世界上最会建网站的人会怎么看？」**

> 他们不会夸你们「像 HF」。  
> 他们会说：你们在用 **导航数量和预设名字制造完成度幻觉**，  
> 媒资复用和空门把信任打穿；  
> 核心 job（玩具图→片）有机会，但 **站点观感目前是半成品壳**。  
> 先砍、先真、先一句说清，再谈 Sunday 给人看。

**「是不是垃圾？」**  
引擎层 **不是**；**对外观感与信息架构，现在确实很垃圾**——该认。

---

## 7. 和「找大神 API」的关系

- **没有** 哥飞/Namya/顶级 agency 的「远程审站 API」。  
- **有的是：** 他们的公开标准 + 竞品实站 + 本机可测证据（本文）。  
- 真人要钱、要约；在约到之前，按 **§5 手术单** 改，比再写报告有用。
