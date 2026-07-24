# 老板公网 Soft Launch 清单（哥飞 P0）

**目标：** 本周 `https://pikbo.ai` 可访问、可试用，不收费。  
**工程侧：** TDH 已冻结、Generate/首页 demo 在主仓持续维护。  
**没有下面 1–3 步，公网日期不存在。**

---

## 你今天必须做的（blocker）

### 1. Vercel 部署

- [ ] 登录 Vercel，Import 仓库 `pikbo`（或当前 GitHub 远程）
- [ ] Framework：Next.js；Root 默认
- [ ] 部署成功 → 记下 `*.vercel.app` 预览 URL

### 2. 生产环境变量（最少）

在 Vercel Project → Settings → Environment Variables（Production）：

| 变量 | 用途 |
|------|------|
| `SESSION_SECRET` | 会话签名（随机长串） |
| `FAL_KEY` | Seedance 实时生成（无则仅 demo-cached） |

可选稍后：`NEXT_PUBLIC_SUPABASE_*`、`VIDEO_PROVIDER_WEBHOOK_SECRET`、Stripe（**先不要开 live**）。

### 3. 域名 pikbo.ai

- [ ] 域名 DNS 按 Vercel 指引添加
- [ ] 绑定到该 Project Production
- [ ] HTTPS 生效后访问首页，确认 3–6 条 demo + CTA + 能进 `/create`

---

## 先上后补（明确不做 blocker）

- [ ] T6 服务端水印（收费前再做）
- [ ] Supabase 跨设备积分
- [ ] Stripe 收款
- [ ] 真 UGC 社区
- [ ] 像素对标 HF 全模块

---

## 上线后 14 天你只要盯

1. 预览/公网是否 200、Generate 是否能出片  
2. Search Console 属性加好、sitemap 提交  
3. 不要改首页 Title / Description / H1（冻结）  

---

## 工程已对齐（参考）

- 决策全文：`docs/growth/GEFEI_LAUNCH_DECISION_2026-07-24.md`  
- TDH 常量：`lib/site.ts`（`titleDefault` / `description` / `homeH1`）— **上线后 1–4 周勿改**  
- 首页：`SoftLaunchStrip` 免费试用 CTA + Viral demo 墙  
- SEO 意图页已存在：`/for/*`（约 7）· `/tools/*`（约 14）· 进 sitemap（有 Lab proof 的）  
- 本地验收：`http://localhost:3000` → `/` → `/create?try=1&sample=scout`  

部署完成后把 **预览 URL** 或 **pikbo.ai 已解析** 发我，我跑 link-check + health 验收。
