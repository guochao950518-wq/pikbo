# pikbo.ai 上线作战手册（老板点这里）

预计总时间：30～60 分钟（等 DNS 可能更久）。

---

## 阶段 1 — 先让网站在公网跑起来（必须）

### 1.1 部署到 Vercel
1. 打开 https://vercel.com/signup  
2. **Continue with GitHub**  
3. 授权后 **Add New → Project**  
4. 选仓库 **`guochao950518-wq/pikbo`** → **Import**  
5. 不要改构建命令，直接 **Deploy**  
6. 等绿勾，点开 `https://xxx.vercel.app`  
7. 确认能看见 Pikbo 首页、能进 Create

### 1.2 环境变量（先加这两个就够演示）
Vercel 项目 → **Settings → Environment Variables** → 对 Production 添加：

| Name | Value |
|---|---|
| `SESSION_SECRET` | 随便一串长密码（例如 32 位随机） |
| `FAL_KEY` | （有 fal 账号再填；没有也能打开站，生成是 demo 片） |

保存后 **Deployments → 最新一次 → Redeploy**。

生成 `SESSION_SECRET`（在自己电脑终端）：
```bash
openssl rand -base64 32
```

---

## 阶段 2 — 域名 pikbo.ai 指到 Vercel（必须）

你的域名在 **Spaceship**（DNS：launch1/2.spaceship.net）。

### 2.1 在 Vercel 添加域名
1. 项目 → **Settings → Domains**  
2. 添加 `pikbo.ai`  
3. 添加 `www.pikbo.ai`  
4. **照抄 Vercel 页面上显示的记录**（若与下表不同，以 Vercel 为准）

### 2.2 常见 DNS（Spaceship → DNS）

| Type | Host/Name | Value | TTL |
|---|---|---|---|
| **A** | `@` | `76.76.21.21` | 自动/300 |
| **CNAME** | `www` | `cname.vercel-dns.com` | 自动/300 |

操作：
1. 登录 https://www.spaceship.com  
2. 域名 **pikbo.ai** → **DNS**  
3. **删除** 旧的 A 记录（现在指 AWS 占位页的那些）  
4. 按上表 **新增**  
5. 保存  

### 2.3 怎么算成功
- Vercel Domains 显示 **Valid**  
- 浏览器打开 https://pikbo.ai 是 Pikbo 站（不是旧占位页）  
- 可能要等 5 分钟～24 小时，多数 30 分钟内  

---

## 阶段 3 — 真出片（强烈建议当天或次日）

1. 注册 https://fal.ai → Keys → 复制  
2. Vercel 加 `FAL_KEY` → Redeploy  
3. /create 上传玩具图试一条  

---

## 阶段 4 — 收钱（可本周内）

1. https://dashboard.stripe.com/register → 先用 **Test mode**  
2. 建 Creator $19 / Shop $49 订阅，复制 Price ID  
3. Vercel 加：
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PRICE_CREATOR`
   - `STRIPE_PRICE_SHOP`
   - `STRIPE_WEBHOOK_SECRET`（Webhook 指到 `https://pikbo.ai/api/webhooks/stripe`）
   - `NEXT_PUBLIC_SITE_URL=https://pikbo.ai`
4. Redeploy  

---

## 阶段 5 — Telegram 总控（可并行）

见 `tools/README_TELEGRAM.md`：
1. @BotFather → `/newbot` → Token  
2. 本机 `python3 tools/telegram_dispatch_bot.py`  
3. 手机发「派活：…」  

---

## 验收清单（上线完成定义）

- [ ] https://pikbo.ai 打开是 Pikbo  
- [ ] /create 能上传并生成（demo 或真片）  
- [ ] /pricing 能打开  
- [ ] 免费有积分/水印逻辑  
- [ ] （可选）Stripe 测试订阅走通  
- [ ] （可选）Telegram 能写入 DISPATCH  

---

## 卡住了怎么喊 Grok

直接说：
- 「卡在 Vercel 第几步，屏幕写…」  
- 「Spaceship 没有 A 记录怎么加」  
- 「域名还是旧页面」  
- 「Token 是 …」（密钥请私聊，不要发群）
