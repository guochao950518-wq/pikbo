# 老板指令板（只改这一份）

> **你（老板）只在这里写目标。**  
> Grok / Codex(GPT) / Claude 每次开工先 `git pull`，再读本文件，**只做分给自己的区块**。

**更新时间：** 2026-07-22  
**总目标：** 潮玩 AI 视频站 pikbo.ai 上线能用、能收款

---

## 老板原话（你随便写）

```
我有域名 pikbo.ai，还没弄清楚怎么同时指挥三个 AI。
需要你们都帮我干活：网站部署上线、真能出片、能收费。
我只会用手机/聊天下指令，不想复制三遍。
```

---

## 自动拆工（Agent 认领后开干）

### 给 Grok（工程 / 部署 / 支付）
- [ ] 带老板完成：**Vercel 部署 pikbo 仓库**
- [ ] 带老板完成：**Spaceship 把 pikbo.ai DNS 指到 Vercel**
- [ ] 环境变量清单写清楚（FAL / Stripe / SESSION）
- [ ] 修线上问题；支付/积分继续稳
- [ ] 维护本 DISPATCH / STATUS；需要时拆任务

**分支前缀：** `agent/grok/...`　**提交前缀：** `[grok]`

### 给 Codex / GPT（首页 / 转化 / 样片）
- [ ] T2：首页真实 before/after 或样片区（可先占位视频 + 文案）
- [ ] 定价/CTA 文案更像「卖工具」
- [ ] 不要大改 `lib/session` / Stripe webhook

**分支前缀：** `agent/gpt/...`　**提交前缀：** `[gpt]`

### 给 Claude（SEO / 内容）
- [ ] 继续长尾：effects / for / toys 质量页（不灌水）
- [ ] 检查内链；sitemap 是否跟上
- [ ] 不要重写支付与 session

**分支前缀：** `agent/claude/...`　**提交前缀：** `[claude]`

---

## 老板本周只要做的事（人肉，AI 代替不了）

1. [ ] Vercel 用 GitHub 登录 → Import `pikbo` → Deploy  
2. [ ] Spaceship 改 DNS 绑 `pikbo.ai`  
3. [ ] 注册 fal.ai 拿 `FAL_KEY`（真出片）  
4. [ ] （可后做）Stripe 测试模式  
5. [ ] （可后做）Telegram Bot Token 发给 Grok 接总控

---

## 三个 Agent 的「同一句开工口令」（复制一次，三个窗口各贴一次）

```text
仓库：https://github.com/guochao950518-wq/pikbo
执行：git fetch && git checkout main && git pull --ff-only
必读：docs/DISPATCH.md （只做「分给你」的那一节）+ docs/STATUS.md + docs/HANDOFF.md
规则：分支 agent/<你>/<topic>，提交 [你的名字]，做完 push，勾掉 DISPATCH 里你的 checkbox，更新 STATUS
不要 force-push main，不要提交密钥
```

---

## 最近完成（摘要）

- 站点骨架、创作台、积分、定价、SEO 三轴、Stripe webhook、法律页 — 见 HANDOFF
