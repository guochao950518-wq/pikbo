# Site critique — Pikbo (2026-07-23)

Panel: 哥飞 SEO · Namya SaaS convert · AIDA CRO · Product-led indie  
Skill: `.grok/skills/site-critique` · Surface: home + explore/community + tool paths

---

## Scorecard (1–5)

| Lens | Score | One-line |
|------|-------|----------|
| 哥飞 SEO | **2.5** | 套件首页很强，**单关键词工具页/搜索语言**仍弱；冷 SEO 流量不易「一页完成工作」 |
| Namya convert | **2.5** | 视频与氛围满分，**结果型承诺 / 社证 / 一句话 ICP** 不足 |
| AIDA CRO | **2** | Attention 有媒体；Transformation/Desire/FAQ 在首页几乎断层 |
| Product-led | **3.5** | 产品展示（可播 demo）好；付费前「得到什么」与信任层仍薄 |

**综合：** 留存向 HF 壳已成型；**获客转化与 SEO 承接**是下一刀，不是再堆视频密度。

---

## What's working

1. **Video-first retention** — hero 循环、rail、masonry、intersection autoplay，方向对（对齐 HF / 产品可感）。
2. **Niche 正确** — `site.ts` 明确 designer toys + Seedance，没有做成泛 AI 视频站。
3. **转化路径存在** — sticky Generate、tile Recreate、mobile 中心 Generate、batch 入口。
4. **诚实基线** — free / watermark / Seedance 文案有出现，优于假 multi-model。
5. **套件 IA** — create / effects / explore / community / cinema 分面清晰。

---

## P0（本周就该动）

### 1. 首屏「谁 · 问题 · 结果」一句话（Namya + 哥飞）

**问题：** Hero 是 *One photo. Endless clips.* — 酷，但冷流量 5 秒内不知道是 **潮玩/盲盒卖家与收藏家** 的工具。

**改：** H1/副标题改成买家语言，例如：

- H1: **Turn one figure photo into listing & TikTok clips**
- Sub: **For designer-toy sellers & collectors · Seedance motion · free watermarked tries**

**文件：** `components/HeroVideoBanner.tsx` · `lib/site.ts` tagline

### 2. 首屏下方补「3 步」Transformation（AIDA）

**问题：** 滚动即视频墙，没有 *Upload → Pick look → Export* 的认知脚手架。

**改：** Hero 下或 sticky 旁 3 步条（图文 10 字内），链到 `/create`。

**文件：** `app/page.tsx` 新 section 或复用/瘦身 `LandingHowItWorks`

### 3. 伪造/占位也要有的「社会证明位」（Namya Desire）

**问题：** 无评分、无 logo 墙、无用户结果条；demo 是官方片，不是「别人的玩具」。

**改（可渐进）：**

- 「Used on shelf photos like…」+ 3 张用户式 before/after 静态（可先官方 demos 标 Official）
- 一行 trust：*Free · no card · ~3 clips · watermark on free*
- 定价入口进顶栏/首屏次 CTA（已有 Pricing 链，可更近 fold）

**文件：** `app/page.tsx` · 可新建 `components/TrustStrip` 增强

### 4. SEO 工具页优先于再堆首页（哥飞）

**问题：** 首页像 suite；Google 词是 *designer toy video* / *blind box unboxing AI* 等，应落在 **可索引工具+结果页**。

**改：**

- 审计 `/effects/[slug]` 是否 **工具在上、说明/FAQ 可爬、canonical、内链**
- 每词一页：至少 5–10 个高意图 slug 达标 V2（见 `docs/GEFEI_KEYWORD_LANDING.md`）
- 首页链出「Popular searches」chip → 工具页

**文件：** `app/effects/[slug]/` · `app/for/` · `CreateSeoFooter` 用法

### 5. 主 CTA 语言统一成「动作」（Namya）

| 现状 | 建议 |
|------|------|
| Generate free | **Animate my figure free** 或 **Upload photo — free** |
| Recreate | 保留（好） |
| Batch | **Batch 10 looks**（带结果感） |

---

## P1

1. **FAQ 区块（首页或 /create 底）** — 水印？商用？要账号吗？用什么模型？多长？  
2. **Pricing 可发现性** — sticky 或 hero 旁 *See plans*；估费器链近生成成功页。  
3. **对比条** — Phone video vs Pikbo preset（卖家痛点：统一片长/镜头）。  
4. **Explore/Community** — 文案从「wall」补一句 *Remake with your SKU photo*。  
5. **GSC / sitemap** — 上线后提交；内页优先于品牌词。

---

## P2 / later

- 真用户 UGC 墙（账号系统后）  
- 销售/客服对话挖异议（Namya「偷销售通话原文」）  
- 多语言/本地化（哥飞工具站起量路径）  
- A/B 只测标题与 CTA，不先大改视觉系统  

---

## Copy rewrites（建议）

| Where | Current | Suggested |
|-------|---------|-----------|
| site.tagline | Bring your designer toys to life | Listing-ready clips from one figure photo |
| Hero H1 | One photo. Endless clips. | One photo → shelf & social clips |
| Sticky | Scroll · every tile plays | Free try · remake any look with your toy |
| Convert card | Stop scrolling. Animate your figure. | （可保留）+ *No card · watermark on free* |

---

## Do not do

- 再把首页做成更花的纯品牌片，牺牲 ICP 文字  
- 假装多模型 / 去掉水印诚实说明  
- 为「像 HF」牺牲单关键词工具页的 SEO 职责  
- 同时改 20 个页面；先 P0 五条  

---

## Panel source notes (X)

- 哥飞 @gefei55 — SEO 落地页、多站、工具页、判词 ROI  
- Namya @namyakhann — SaaS 落地页转化清单与结构  
- Oliver Kenyon — Attention→Action 结构  
- Indie peers（如 Om Patel 等）— 展示结果、去装饰噪音  

详细框架：`.grok/skills/site-critique/references/experts.md`
