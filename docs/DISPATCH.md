# DISPATCH — 周日 soft 上线（无 Stripe）

**老板：** 最晚 **周日** 上线；**Stripe 还没开好** → 按 soft launch，不收费。  
**硬截止：** 2026-07-26 前 `https://pikbo.ai` 可打开并走 Create。  
**详表：** `docs/SPRINT_3DAY.md` · **部署：** `docs/LAUNCH.md`  

---

## 决策（第一性原理）

| 要 | 不要 |
|----|------|
| 公网能出片 / 诚实 demo | 等 Stripe 才上线 |
| Free Mini 试玩 | 假装能买 Creator/Shop |
| SESSION_SECRET + FAL_KEY | STRIPE_* / PAYMENTS_ENABLED |

付费按钮：**Coming soon**（代码已按此收紧）。

---

## 日历（周四 7/23 起）

| 天 | 焦点 |
|----|------|
| **今天～周五** | Create preflight + 所有权 + 结果标签；Pricing Coming soon |
| **周六** | 禁用词扫尾、3 图手测、Vercel 预部署 `*.vercel.app` |
| **周日** | 域名绑 pikbo.ai · 公网手测 · 小范围分享 |

---

## Claude

```text
【周日 soft 上线 · 无 Stripe · 你写代码】
git pull origin main
git checkout -B agent/claude/soft-launch-polish
读 docs/SPRINT_3DAY.md + docs/prd/SOFT_LAUNCH.md + docs/LAUNCH.md
优先 Create 诚实主路径；Pricing 已 Coming soon 可再核对
周六前 push。禁止接真 Stripe。
```

## GPT

```text
【周日 soft · 无 Stripe】
补 docs/prd/SOFT_LAUNCH_OPS.md：仅 SESSION_SECRET+FAL_KEY；明确无 STRIPE
验收 10 条给老板周日勾。
```

## Grok

- 合流 · 上线剧本 · 老板周日陪 LAUNCH  
- 增长不挡上线  

---

## 老板周日清单（30～60 分）

1. Vercel Import 仓库 Deploy  
2. Env：`SESSION_SECRET` + `FAL_KEY` only  
3. 域名 pikbo.ai → Vercel  
4. 手机 Create 试一条  
5. 确认 Pricing 付费是 Coming soon  
