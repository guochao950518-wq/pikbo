# 老板指令板 — 紧急上线冲刺

> **总目标：尽快让 pikbo.ai 能打开、能试玩、能收费骨架就绪**  
> Agent 只做自己区块。老板只做人肉注册/点按钮。

**更新时间：** 2026-07-22（紧急）  
**优先级：** 上线 > 完美

---

## 老板原话

```
都做。网站还有机会，加紧上线。
域名 pikbo.ai 已买。要 Telegram 总控 + 三个 AI 一起干活 + 部署上线。
```

---

## 拆工

### 给 Grok（工程 / 部署 / 支付）— 主路径
- [x] 代码可 build；Stripe webhook / 积分 / 法律页
- [x] DISPATCH + Telegram 派活脚本
- [ ] **带老板完成 Vercel Deploy**
- [ ] **带老板完成 pikbo.ai DNS → Vercel**
- [ ] 环境变量清单（SESSION_SECRET 先上；FAL/Stripe 可后补）
- [ ] 上线后冒烟：首页 / create / pricing 能开
- [ ] 接 Telegram Token 后帮老板跑 bot

**分支：** `agent/grok/...`　**提交：** `[grok]`

### 给 Codex / GPT（首页 / 转化 / 样片）
- [ ] **今天：** 首页更像能卖的产品（样片区、信任文案、CTA）
- [ ] 去掉「半成品感」；强调 designer toys only
- [ ] 不要动 session / stripe / webhook
- [ ] push 后在 DISPATCH 勾选

**分支：** `agent/gpt/launch-homepage`　**提交：** `[gpt]`

### 给 Claude（SEO / 内容）
- [ ] **今天：** 首页下方或 Footer 加强内链；1～2 个高意图 SEO 补强即可
- [ ] 检查新建页无 broken 内链
- [ ] 不要重写支付
- [ ] push 后勾选

**分支：** `agent/claude/launch-seo`　**提交：** `[claude]`

---

## 老板今天必须点的按钮（只有人能做）

1. [ ] https://vercel.com/signup → GitHub 登录 → Import **pikbo** → **Deploy**
2. [ ] Vercel → Settings → Domains → 加 `pikbo.ai` + `www.pikbo.ai`
3. [ ] Spaceship DNS：按 Vercel 提示改 A/CNAME（详见 `docs/LAUNCH.md`）
4. [ ] （可选今天）fal.ai 注册拿 key → Vercel 环境变量 `FAL_KEY` + `SESSION_SECRET` → Redeploy
5. [ ] （可选）@BotFather `/newbot` → Token 私发给 Grok

---

## 三个 Agent 同一句开工口令（复制三次）

```text
紧急上线冲刺。仓库：https://github.com/guochao950518-wq/pikbo
git fetch && git checkout main && git pull --ff-only
必读 docs/DISPATCH.md（只做分给你的一节）+ docs/LAUNCH.md + docs/STATUS.md
分支 agent/<你>/launch-* ，提交 [你]，做完立刻 push，勾 DISPATCH
不要 force-push main，不要提交密钥。速度优先，可上线优先。
```
