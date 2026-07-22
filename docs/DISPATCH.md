# 老板指令板 — 先抄站，后潮玩，不上线

> **暂停部署/上线。**  
> 目标：按 Higgsfield / Yiha 的 **产品结构与交互** 1:1 级复刻（自有品牌 Pikbo，不盗 Logo/素材），再改成潮玩垂直。

**更新时间：** 2026-07-22  
**规格全文：** `docs/COMPETITOR_SPEC.md`

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

### Grok — App 壳 + Generate 工作台（主）
- [x] 规格 COMPETITOR_SPEC
- [ ] AppShell：Home / Generate / Library / Community / Pricing / Profile
- [ ] `/create` 改成 Higgsfield 级 Generate 工作台（模型条 Seedance、上传、prompt、参数、结果）
- [ ] `/library` `/profile` `/community` 骨架页
- [ ] 保持 Seedance 出片 API

**分支：** `agent/grok/clone-shell`　**提交：** `[grok]`

### GPT / Codex — 首页像模型产品站
- [ ] 首页：大 Hero、模型卡片（Seedance 主推）、预设瀑布/网格、社区条
- [ ] 定价页文案像 AI 视频 SaaS（仍用 Pikbo 名）
- [ ] 不要改 generate API

**分支：** `agent/gpt/clone-home`　**提交：** `[gpt]`

### Claude — 预设密度 + 社区/内容
- [ ] effects 列表页做成 Viral Presets 墙
- [ ] community 假数据/示例项目墙
- [ ] 文案先通用 AI video 口吻，预留潮玩替换点

**分支：** `agent/claude/clone-presets`　**提交：** `[claude]`

---

## 三个 Agent 同一句开工口令

```text
仓库：https://github.com/guochao950518-wq/pikbo
git fetch && git checkout main && git pull --ff-only
必读 docs/DISPATCH.md + docs/COMPETITOR_SPEC.md
目标：先按 Higgsfield/Yiha 的模块与交互 1:1 级复刻（自有 UI，禁止盗他们品牌素材），暂不上线。
只做分给你的区块，分支 agent/<你>/clone-*，提交 [你]，push。
出片模型保持字节 Seedance。
```

---

## 法律红线
禁止提交 Higgsfield/Yiha 的 logo、官网截图当素材、整页复制文案。结构与交互对齐即可。
