# 建站大神审站 API 清单（Pikbo）

**日期：** 2026-07-23  
**先说清楚一件事：**

> **哥飞 / Namya / 刘小排 等「建站大神」没有对外开放的「专家审站 API」。**  
> 他们是人 + 社群 + 方法论。  
> 他们日常**调用来审站**的，是下面这些 **公开/半公开接口与工具**。

本文件 = **大神会用的接口 + 我们怎么拿来审 Pikbo**。

---

## 0. 能立刻用的层级

| 层级 | 能否 API 审 | 何时可用 | 对应大神关心点 |
|------|-------------|---------|----------------|
| **Lighthouse / PageSpeed** | ✅ 真 API | 公网 URL 后（本地可 Lighthouse） | 速度、基础 SEO、可访问性 |
| **Google Search Console API** | ✅ 真 API | 域名验证后 | 收录、搜索词、覆盖 |
| **DataForSEO On-Page** | ✅ 付费 API | 公网后 | 哥飞系：on-page 技术分 60+ 项 |
| **GTmetrix API** | ✅ 需 key | 公网后 | 性能瀑布图、Lighthouse 复测 |
| **Ahrefs Site Audit** | ⚠ 免费网页为主，完整 API 贵 | 验证站点后 | 哥飞最爱：KD/外链/技术审计 |
| **专家本人（哥飞评站）** | ❌ 无 API | 社群/付费问诊 | 产品+关键词+内页矩阵 |

---

## 1. 免费 / 准免费 · 立刻优先（推荐）

### 1.1 Google PageSpeed Insights API ⭐ 首选

| 项 | 内容 |
|----|------|
| **用途** | 性能 / SEO / 无障碍 / 最佳实践（Lighthouse 同款） |
| **费用** | 免费；约 25,000 次/天 |
| **文档** | https://developers.google.com/speed/docs/insights/v5/get-started |
| **网页版（无 key）** | https://pagespeed.web.dev/ |
| **前提** | **必须公网 URL**（扫不了 localhost） |

**拿 key：**  
[Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials) 启用 *PageSpeed Insights API*。

**curl（上线后把 URL 换成 pikbo.ai）：**

```bash
# 移动端
curl -sS "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?\
url=https://pikbo.ai&\
strategy=mobile&\
category=performance&\
category=seo&\
category=accessibility&\
category=best-practices&\
key=YOUR_PSI_KEY" | jq '.lighthouseResult.categories | to_entries[] | {cat:.key, score:(.value.score*100|floor)}'

# 桌面
curl -sS "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?\
url=https://pikbo.ai&\
strategy=desktop&\
key=YOUR_PSI_KEY" -o /tmp/psi-desktop.json
```

**大神会看哪些分：**  
Performance ≥ 70（soft 可放宽）、SEO ≥ 90、LCP / CLS / TBT。

---

### 1.2 Lighthouse CLI（本地，现在就能审）

| 项 | 内容 |
|----|------|
| **用途** | 与 PSI 同引擎，可打 localhost |
| **费用** | 免费 |
| **前提** | 本机 Chrome + Node |

```bash
# 审本机 soft 站
npx lighthouse http://localhost:3000 \
  --only-categories=performance,seo,accessibility,best-practices \
  --output=html --output-path=./docs/audit-local.html \
  --chrome-flags="--headless --no-sandbox" \
  --view

# 上线后审公网
npx lighthouse https://pikbo.ai --view
```

---

### 1.3 Google Search Console API

| 项 | 内容 |
|----|------|
| **用途** | 索引状态、搜索展示/点击、覆盖错误（哥飞「上站后第二步」） |
| **费用** | 免费 |
| **文档** | https://developers.google.com/webmaster-tools/v1/api_reference_index |
| **前提** | 域名验证 + OAuth |

哥飞流程：Vercel 上线 → 绑 GSC → 提交 sitemap → 看收录。  
API 适合自动化读报表，**首次验证仍要浏览器走一遍**。

网页：https://search.google.com/search-console

---

### 1.4 Ahrefs Webmaster Tools（哥飞最常用工具，非开放 REST）

| 项 | 内容 |
|----|------|
| **用途** | Site Audit 170+ 技术/on-page 问题；外链与关键词（自有站） |
| **费用** | **免费**（验证自己的站） |
| **入口** | https://ahrefs.com/webmaster-tools · https://ahrefs.com/site-audit |
| **API** | 完整 Ahrefs API 是企业级付费；**免费档主要是网页** |

**大神用法：** 验证 pikbo.ai → 跑 Site Audit → 修 critical → 再看 Keywords。  
不是「调用专家大脑的 API」，而是**大神天天点的按钮**。

---

## 2. 付费 / 专业审站 API（更像「自动化 SEO 顾问」）

### 2.1 DataForSEO On-Page API ⭐ 最接近「程序化审站」

| 项 | 内容 |
|----|------|
| **用途** | 爬整站 + 60+ on-page 指标：状态码、meta、内链、重复内容、速度 |
| **费用** | 按任务计费（有免费试用额度） |
| **文档** | https://dataforseo.com/apis/on-page-api |
| **控制台** | https://app.dataforseo.com/register |

适合：周日上线后做一次全站技术审计，输出「像 SEO 顾问」的 checklist。

典型能力：HTTP 状态、title/description 缺失、H1 结构、canonical、内链、页面大小、PageSpeed 嵌入结果。

---

### 2.2 GTmetrix REST API v2

| 项 | 内容 |
|----|------|
| **用途** | 性能报告 + Lighthouse；瀑布图分析 |
| **费用** | 需账号与 API key / credits |
| **文档** | https://gtmetrix.com/api/docs/2.0/ |
| **Base** | `https://gtmetrix.com/api/2.0/` |

```bash
# 创建测试（需 API key 作为 Basic Auth 用户名）
curl -u YOUR_API_KEY: \
  -X POST https://gtmetrix.com/api/2.0/tests \
  -d url=https://pikbo.ai
```

网页版（先人肉看）：https://gtmetrix.com/

---

### 2.3 WebPageTest / Catchpoint API

| 项 | 内容 |
|----|------|
| **用途** | 多地区真实浏览器加载、filmstrip、高级性能 |
| **文档** | https://www.webpagetest.org/ · Catchpoint 产品 API |
| **费用** | 免费额度有限；Pro 才有完整 API |

---

### 2.4 其他常见（大神偶尔提）

| 工具 | 类型 | 链接 |
|------|------|------|
| SEMrush Site Audit | 网页 + 企业 API | https://www.semrush.com/ |
| Screaming Frog | 桌面爬虫，无云 API | https://www.screamingfrog.co.uk/seo-spider/ |
| Similarweb | 竞品流量（判词辅助） | 付费 API |
| Moz / Majestic | 外链 | 付费 API |

---

## 3. 「建站大神本人」怎么审（无 API）

| 人/派 | 有没有 API | 实际入口 |
|--------|------------|----------|
| **哥飞 @gefei55** | ❌ | 公众号/社群/评站文；用 Ahrefs + GSC + 人眼看 SERP |
| **Namya / Supafast** | ❌ | 转化结构人工 review（CTA/ICP/社证） |
| **刘小排等** | ❌ | 产品叙事 + 出货速度，不是 SEO 爬虫 |

**若要「真人专家审」：** 进哥飞系社群投稿「评站」，或付费做 1 次 landing review。  
**不要指望** 有一个 `POST /api/gefei/review {url}`。

我们仓库里的替代方案（已落地）：

- 方法论技能：`.grok/skills/site-critique/`  
- 专家面板报告：`docs/SITE_EXPERT_REVIEW_2026-07-23.md`  
- 竞品对照：`docs/COMPETITOR_SITE_PATTERNS.md`

---

## 4. 推荐给 Pikbo 的「审站流水线」（可执行）

### 现在（localhost soft）

```bash
# 1) 本地 Lighthouse
npx lighthouse http://localhost:3000 --view

# 2) 手测路径（大神也在意「能不能完成任务」）
# / → Generate → 上传玩具图 → 出片
# /pricing → Coming soon（无假支付）
# /effects/* → 能进 Create
```

### 周日公网上线后（15 分钟）

| 步 | 动作 |
|----|------|
| 1 | 打开 https://pagespeed.web.dev/ 贴 `https://pikbo.ai`（mobile + desktop） |
| 2 | （可选）申请 PSI API key，脚本扫 `/` `/create` `/pricing` `/effects` |
| 3 | 绑 [Search Console](https://search.google.com/search-console) + 提交 sitemap |
| 4 | 注册 [Ahrefs Webmaster Tools](https://ahrefs.com/webmaster-tools) 验证域名 → Site Audit |
| 5 | （可选）DataForSEO On-Page 全站爬一次，出 issue 列表给 Claude 修 |

### 一键脚本骨架（上线后填 KEY）

```bash
#!/usr/bin/env bash
# scripts/audit-pagespeed.sh
set -euo pipefail
KEY="${PSI_API_KEY:?set PSI_API_KEY}"
BASE="${1:-https://pikbo.ai}"
for path in "" "/create" "/pricing" "/effects"; do
  url="${BASE}${path}"
  echo "=== $url ==="
  curl -sS "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=$(python3 -c "import urllib.parse;print(urllib.parse.quote('$url'))")&strategy=mobile&key=$KEY" \
    | jq -r '.lighthouseResult.categories | to_entries[] | "\(.key): \((.value.score//0)*100|floor)"'
done
```

---

## 5. 接口速查表（复制用）

| API | Endpoint / 入口 | Key? | 免费? |
|-----|-----------------|------|-------|
| PageSpeed Insights | `https://www.googleapis.com/pagespeedonline/v5/runPagespeed` | 建议有 | ✅ |
| PageSpeed 网页 | https://pagespeed.web.dev/ | 否 | ✅ |
| Lighthouse CLI | `npx lighthouse <url>` | 否 | ✅ |
| GSC | Google Webmaster API v1 | OAuth | ✅ |
| GTmetrix | `https://gtmetrix.com/api/2.0/tests` | 是 | 额度 |
| DataForSEO On-Page | dataforseo.com/apis/on-page-api | 是 | 试用+付费 |
| Ahrefs Site Audit | 网页 AWT | 账号 | 自有站免费 |
| 哥飞本人 | 无 | — | 社群 |

---

## 6. 给老板的结论

1. **没有「哥飞 API」** — 只有「哥飞会用的 API」。  
2. **现在就能做：** 本地 Lighthouse + 我们专家报告 + 手测出片。  
3. **上线后 15 分钟专家级技术审：** PageSpeed 网页 + Ahrefs Webmaster Tools Site Audit。  
4. **要程序化批量审：** PSI API 或 DataForSEO On-Page。  
5. **要产品/转化/判词真人意见：** 社群评站，不是 HTTP 接口。

相关：`docs/SITE_EXPERT_REVIEW_2026-07-23.md` · `docs/LAUNCH.md` · `docs/growth/SEO_PRIORITY.md`
