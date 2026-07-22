# 老板指令板 — 先打磨产品闭环，暂不公开上线

> **暂停公开部署和真实收款。**
> 最新目标：不再继续堆空壳模块，优先完成真实账户、持久积分、异步生成、云端资产、支付测试和服务端水印。
> 品牌必须是 Pikbo，专注“自己的潮玩照片 → 商业短视频”；禁止盗用竞品 Logo、文案或媒体。

**更新时间：** 2026-07-22
**规格全文：** `docs/COMPETITOR_SPEC.md`
**上线前门禁：** `docs/PRELAUNCH_AUDIT.md`（找毛病 → 找差异 → 诚实对齐 → 再创新 → 再上线）

---

## 老板原话

```
网站还没有做好，先不考虑上线。
三个 agent 先抄他们的网站，再改成潮玩。
要求 1:1 抄（结构/交互/模块对齐 Higgsfield + Yiha 用法）。
出片用字节模型。
```

---

## 拆工

### Grok — 生产稳定性与账务
- [x] 规格 COMPETITOR_SPEC
- [x] AppShell：Home / Generate / Library / Community / Pricing / Profile
- [x] `/create` Higgsfield 级 Generate（Seedance 条、上传、prompt、结果）
- [x] `/library` 本机历史 + `/profile` `/community` 骨架
- [x] 首页 Hero + Models + PresetsWall 接入
- [x] 保持 Seedance 出片 API
- [ ] 复核异步任务、积分预扣/退款、Stripe Webhook 幂等与失败路径
- [ ] 不得在正式环境使用 Cookie 积分或本地 JSON 冒充持久数据

**分支：** `main`　**提交：** `[grok]`

### GPT / Codex — 产品闭环与 Studio
- [x] 诚实 Demo：无 FAL 时不扣积分，不冒充模型输出
- [x] 多素材 Studio：正面必填，侧面/背面/包装可选
- [x] 异步任务、项目、资产上传、重试与 SKU Campaign
- [x] 支付入口真实性、账单门户、年付配置门控、自动化测试
- [ ] 用真实 Supabase / fal / Stripe test / ffmpeg 完成集成验收（外部配置 blocker）

**分支：** `agent/gpt/product-foundation`　**提交：** `[gpt]`

### Claude — QA、内容真实性与 SEO
- [x] PresetsWall 密铺 + effects 页
- [x] community 墙
- [x] 再补 4 个 viral preset（smoke-burst / paint-splash / power-aura / hologram-glitch，质量优先）
- [ ] 复核所有页面无虚构社区内容、无不实模型/客户/收入声明
- [ ] 检查 sitemap、robots、结构化数据、内链和移动端回归

**分支：** `agent/claude/clone-presets`　**提交：** `[claude]`

---

## 三个 Agent 同一句开工口令

```text
仓库：https://github.com/guochao950518-wq/pikbo
git fetch && git checkout main && git pull --ff-only
必读 docs/DISPATCH.md + docs/COMPETITOR_SPEC.md
目标：先完成 PIKBO 潮玩视频产品闭环；借鉴竞品工作流，不复制品牌素材，暂不上线。
只做分给你的区块，分支 agent/<你>/<topic>，提交 [你]，push。
出片模型保持字节 Seedance。
```

---

## 法律红线
禁止提交 Higgsfield/Yiha 的 logo、官网截图当素材、整页复制文案。结构与交互对齐即可。

---

## 协调 note — [claude] 2026-07-22（老板授权 Claude 当协调方）

**Claude 做完的（T13 预设墙）：**
- `components/PresetsWall.tsx` — Higgsfield 级密集病毒预设墙，卡片点开直接进 `/create?effect=` 预填；每卡带 "Learn more →" 到 SEO 落地页（内链不丢）。`/effects` 已用上。
- **GPT**：首页要预设墙时，直接 `import { PresetsWall } from "@/components/PresetsWall"` 复用，别重复造。

**给全体的 3 条硬要求：**
1. **别再在共享工作目录里 `git add -A`** —— 已发生两次把别人未提交的 WIP 卷进自己提交。只 `git add <你自己的文件>`，或各开独立 `git worktree`。提交前必 `git status` 看清。
2. **删重复文档**：`COLLABORATION.md` 和 `COLLAB.md` 内容重复 —— 保留 `COLLAB.md`，删掉 `COLLABORATION.md`（谁先碰谁删）。
3. **诚信红线（重要）**：**禁止编造假的社区作品 / 假的"示例视频"当真实用户内容**。社区/首页样片要真实——而真实出片的唯一卡点是 **没有 `FAL_KEY`**。这才是当前真正的 blocker，请一起向老板要 key，别用假内容填充。

**当前外部 blocker：**`FAL_KEY`（真实模型验收）、Supabase 项目（跨设备数据）、Stripe 测试密钥（支付回归）和可运行 ffmpeg 的私有 worker（免费文件水印）。没有这些密钥时继续使用明确标注且不扣积分的私人验证模式，不得声称已完成正式闭环。
