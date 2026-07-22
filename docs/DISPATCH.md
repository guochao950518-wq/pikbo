# 老板指令板 — 先抄站，后潮玩，不上线

> **暂停部署/上线。**  
> 目标：大站有什么模块，我们就铺什么模块（Apps/Models/Cinema/Generate/Library…）。  
> 品牌必须是 Pikbo，**禁止盗用**对方 Logo/官网素材；功能面与信息架构对齐。

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

### Grok — App 壳 + Generate 工作台（主）
- [x] 规格 COMPETITOR_SPEC
- [x] AppShell：Home / Generate / Library / Community / Pricing / Profile
- [x] `/create` Higgsfield 级 Generate（Seedance 条、上传、prompt、结果）
- [x] `/library` 本机历史 + `/profile` `/community` 骨架
- [x] 首页 Hero + Models + PresetsWall 接入
- [x] 保持 Seedance 出片 API
- [ ] 继续抠 Generate 全屏感 / 参数条（时长比例可视化）

**分支：** `main`　**提交：** `[grok]`

### GPT / Codex — 首页像模型产品站
- [ ] 在 Grok 首页基础上再加视觉冲击（真实样片位、动效）
- [ ] 定价转化文案 A/B 优化
- [ ] 不要改 generate API

**分支：** `agent/gpt/clone-home`　**提交：** `[gpt]`

### Claude — 预设密度 + 社区/内容
- [x] PresetsWall 密铺 + effects 页
- [x] community 墙
- [x] 再补 4 个 viral preset（smoke-burst / paint-splash / power-aura / hologram-glitch，质量优先）
- [ ] 文案潮玩化第二轮

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

---

## 协调 note — [claude] 2026-07-22（老板授权 Claude 当协调方）

**Claude 做完的（T13 预设墙）：**
- `components/PresetsWall.tsx` — Higgsfield 级密集病毒预设墙，卡片点开直接进 `/create?effect=` 预填；每卡带 "Learn more →" 到 SEO 落地页（内链不丢）。`/effects` 已用上。
- **GPT**：首页要预设墙时，直接 `import { PresetsWall } from "@/components/PresetsWall"` 复用，别重复造。

**给全体的 3 条硬要求：**
1. **别再在共享工作目录里 `git add -A`** —— 已发生两次把别人未提交的 WIP 卷进自己提交。只 `git add <你自己的文件>`，或各开独立 `git worktree`。提交前必 `git status` 看清。
2. **删重复文档**：`COLLABORATION.md` 和 `COLLAB.md` 内容重复 —— 保留 `COLLAB.md`，删掉 `COLLABORATION.md`（谁先碰谁删）。
3. **诚信红线（重要）**：**禁止编造假的社区作品 / 假的"示例视频"当真实用户内容**。社区/首页样片要真实——而真实出片的唯一卡点是 **没有 `FAL_KEY`**。这才是当前真正的 blocker，请一起向老板要 key，别用假内容填充。

**当前真 blocker：`FAL_KEY`**（没有它 = 零真实出片 = 首页/社区只能放占位）。结构可以继续搭，但"证明能用"必须等 key。

---

## 协调指令 #2 — [claude] 2026-07-22（"从铺壳 → 硬化核心"）

**现状判断:** 外壳/视觉已到旗舰级(约 9/10),但核心 **0 验证**(仍 DEMO、无 FAL_KEY、零真实出片)。**继续堆模块/视觉是边际递减,而且在拉大"承诺 vs 现实"的差距。** 从现在起,不需要 key 也能做的高价值活 = **为真实出片做好准备 + 降低上线翻车风险**。

### 给全体
- **冻结净增新模块/视觉最大化。** Cinema/Apps/Explore/Models 已经够了,别再铺新的。
- **唯一真 blocker 仍是 `FAL_KEY`** —— 一起向老板要,别拿假内容/更多空壳填时间。

### Grok（壳 / Generate / 计费 / 视觉）
1. **硬化真实出片链路**(为 key 到位那一刻做准备):确认"先扣积分 → 失败自动退"真的生效;结果区加显式提示"AI 结果会有波动,不满意免费重出";把 `cached demo → 真实输出` 做成**干净可替换的契约**(对齐 GPT handoff 里的 DemoVideo id 契约)。
2. **收起空模块**:Models 的"coming soon"卡、Cinema/Apps、Community mock —— **要么明确 gate 成"即将上线",要么先隐藏**。"大平台但一半是空的"比"小而精"更掉价。
3. **删重复文档 + 合并手册**(`COLLABORATION.md`、多本 handbook)。

### Codex / GPT（首页 / 定价 / 转化 / product-foundation）
1. **验单位经济**:定价估算器写的 $0.38/条,**必须覆盖 Seedance 真实单条成本 + 手续费 + 利润**——没人算过。免费层 30 积分=3 条,SEO 放量后是纯亏 GPU;建议算完再定,免费额度可能要砍到 1 条带水印。
2. **首页样片别把胃口吊太高**:那些电影级 FEATURED 卡是缓存原型渲染。**明确标注 example/cached,并把最不真实的 1-2 张换成更接近真实 Seedance 水准的**,否则用户真生成后落差 = 差评。
3. **product-foundation 分支别搞成又一次大重写**,小步、别撞 main 现有壳。

**一句话:** 路都铺好了,把火力从"装修"转到"确保点火那一刻不炸"。

---

## 修复指令 #3 — [claude] 审查落地（2026-07-23，请认领并修）

Claude 做了一次正式审查,挖出以下问题,**具体到文件,谁在线谁认领,修完 push + 勾这里**:

### 🔴 P0 — Grok(工程)
1. **加"合并前必须构建通过"的门。** 实证:抓控制台发现 `/pricing` 曾被编译进未解决的 git 冲突标记(`<<<<<<<`),证明共享目录合并会漏发坏页。
   - 建 `.github/workflows/ci.yml`:PR/push 触发 `npm ci && npm run build`,失败即红。
   - 加一步扫冲突标记:`! grep -rnE "^(<<<<<<<|>>>>>>>|=======)" app lib components`。
   - **合 main 前必须绿。** — [ ] 做完勾

### 🟠 P1-配色 — Grok(视觉,你起的柠檬绿改色收尾)
2. **全站配色改了一半。** `app/pricing/page.tsx` 大标题仍是旧粉紫渐变(`text-grad`/旧 `--grad`),与全站柠檬绿主色不一致。
   - 收尾:pricing hero + 全站扫一遍遗留粉紫渐变,统一到新主色系。 — [ ] 做完勾

### 🟠 P1-文案 — Codex/GPT(首页/文案)
3. **文案自相矛盾。** 首页 hero 喊 **"Endless clips"(暗示无限)**,而 `/pricing` 明写 **"No fake unlimited plan"**。自打脸。
   - 把首页 "Endless clips" 改掉(如 "Endless looks" / "A whole content drop"),并扫一遍其它过度承诺文案。 — [~] GPT doing · `agent/gpt/claude-copy-audit`

（P0-核心"真实出片验证"仍等老板给 `FAL_KEY`,非本轮可修。）
