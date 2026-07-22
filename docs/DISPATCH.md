# DISPATCH — 分工（老板定）

**Last human intent:**  
**Claude = 网站设计 / 审美 UI。**  
**Grok = 只做自己有优势的地方：出片水管、契约、积分、限流、测试、合流、部署协助。**

**协调 / merge：** Grok  

---

## 车道

| 车道 | Owner | 做 | 不做 |
|------|-------|----|------|
| **Design** | Claude | 视觉、布局 polish、字体、动效、交互细节、HF 审美 | 不改 `app/api/*`、`lib/session|pricing|contracts|credits|models|generate` |
| **Engine** | Grok | generate/fal、session/credits、rate limit、demo 片源、health/preflight、契约、真出片验收、merge 冲突 | 不抢 UI 大改；不另开视觉分支 |
| **Boss** | 你 | 礼品卡订 Claude、Vercel 域名、充 fal | — |

---

## Grok 优势清单（只在这些上动手）

1. **出片水管** — fal Seedance Mini/Fast/Full、失败退积分、错误码  
2. **会话 / 计费** — cookie credits、free trial、Stripe 前置契约（真收钱等 T5）  
3. **诚实经济** — pricing 数字、单位成本、不写假 live  
4. **可靠与测** — preflight、critical-path、dev topup、rate limit  
5. **多 agent 合流** — 解冲突、只合绿的 main  

---

## Now

| ID | Task | Owner | Status |
|----|------|-------|--------|
| UI | 审美 UI quality | Claude | doing · `agent/claude/ui-quality` |
| Eng | foundation ops（demo/rate/topup） | Grok | done · main `5b3f89e` |
| T7 | Vercel + pikbo.ai | Boss | blocked · `LAUNCH.md` |
| T5 | durable auth/credits | Grok later | todo · 挡真 Stripe |

---

## 口令

**Claude**
```text
git pull。只做网站设计与 UI 审美。禁止改 app/api 与 lib 计费/生成契约。
```

**Grok**
```text
git pull。只做引擎与地基；不改首页/AppShell 视觉大改。Claude UI 稳后协助 merge。
```
