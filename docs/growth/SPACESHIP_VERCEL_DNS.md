# Spaceship 域名 pikbo.ai → Vercel 一步一步

**域名在：** Spaceship  
**网站部署在：** Vercel（Next.js）  
**目标：** `https://pikbo.ai` 打开 Pikbo soft launch  

> DNS 的 A / CNAME **数值以 Vercel Domains 页面当前显示为准**，不要抄死 IP。

---

## 0. 准备

- [ ] GitHub 能看到 pikbo 仓库  
- [ ] [vercel.com](https://vercel.com) 用 **GitHub 登录**  
- [ ] Spaceship 能管理 `pikbo.ai`  
- [ ] 本地 `.env.local` 里有 `SESSION_SECRET`、`FAL_KEY`（部署时要粘贴）

---

## 1. Vercel 导入项目

1. 打开 [vercel.com/dashboard](https://vercel.com/dashboard)  
2. **Add New… → Project**  
3. 找到 **pikbo** → **Import**  
4. Framework：Next.js；Root 空着  
5. 先进入 **Environment Variables**（或 Deploy 后再加再 Redeploy）

---

## 2. 环境变量（Production + 建议 Preview）

| Name | 从哪来 |
|------|--------|
| `SESSION_SECRET` | `.env.local` |
| `FAL_KEY` | `.env.local` |

保存后若已部署过：**Deployments → ⋯ → Redeploy**。

**先不要**开 Stripe live。

---

## 3. 确认预览能开

部署成功 → **Visit** → 类似：

`https://pikbo-xxxx.vercel.app`

检查：首页 / Try free / `/create`。

把这个链接发给工程侧验收。

---

## 4. Vercel 添加域名

1. 项目 **Settings → Domains**  
2. 添加 `pikbo.ai`  
3. 添加 `www.pikbo.ai`（推荐）  
4. 复制页面提示的 DNS：

| 用途 | Type | Host | Value |
|------|------|------|--------|
| 根域名 | **A** | `@` | Vercel 显示的 IP |
| www | **CNAME** | `www` | Vercel 显示的 `*.vercel-dns-….com` |

---

## 5. Spaceship 填 DNS

1. 登录 Spaceship → 域名 **pikbo.ai**  
2. **Advanced DNS Manager** → 该域名 → **Custom records**  
   文档：[DNS records types](https://www.spaceship.com/knowledgebase/dns-records-types/)  
3. 添加 **A**：Host `@`，Value = Vercel 的 A IP  
4. 添加 **CNAME**：Host `www`，Value = Vercel 的 CNAME  
5. 删掉冲突的旧 `@` / `www` 记录  
6. **不要**给 `@` 加 CNAME；**不要**把 CNAME value 写成自己的域名  

---

## 6. 等生效

- Vercel Domains 显示 **Valid**  
- 打开 https://pikbo.ai 与 https://www.pikbo.ai  
- 电脑可查：

```bash
dig pikbo.ai A +short
dig www.pikbo.ai CNAME +short
```

---

## 7. 上线后

1. 首页 demo + Try free 正常  
2. `/create?try=1&sample=scout` 可走  
3. **1–4 周勿改** Title / Description / H1  
4. Google Search Console 加站 + 提交 `https://pikbo.ai/sitemap.xml`  

---

## 卡关

| 现象 | 处理 |
|------|------|
| 无仓库 | GitHub App 权限勾选 pikbo |
| 不能生成 | `FAL_KEY` + Redeploy |
| 一直 Pending | 核对 Host `@`/`www`；清旧记录 |
| 仅 www 可开 | 根域名 A 未配对 |

---

## 你现在该做的

从 **第 1 步 Vercel 登录** 开始；做到预览 URL 后发回来。
