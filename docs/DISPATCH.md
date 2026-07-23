# DISPATCH — 紧急：NO-GO 公开上线 · 先止血再谈 Sunday

**老板质问：** 上线什么？够资格吗？  
**Grok 裁定（2026-07-23）：** **公开公网上线 = NO-GO。** 引擎 soft 有底，**站点观感/空门/假密度不够资格让外人进。**

**证据：** `docs/BRUTAL_EXPERT_ROAST_2026-07-23.md`  
**旧日历暂停：** 原「最晚周日无条件上线」作废，改为 **GO 清单全绿才能部署**。

---

## GO / NO-GO（老板只看这张表）

| # | 门槛 | 现状 | 谁负责做成绿 |
|---|------|------|--------------|
| G1 | 顶栏无空门（Models Soon / 假 Cinema/Batch 不装完整产品） | ⚠ 黄 · Grok 已压主 nav 为 Explore/Create/Lab/Library + More（`237068e`）；等 GPT 白名单 + Claude 再收 | **Claude 实现** · GPT 定「允许露出的导航」 |
| G2 | 首页主推预设 ≤8，**一预设一真片**，禁止 shared-loop 墙 | ❌ 红 | **Claude** · GPT 定保留哪 8 个 |
| G3 | Lab/Feed 不暗示真 UGC；文案 Official demos | ❌ 偏红 | **Codex 文案** · Claude 合 |
| G4 | 所有页脚 `/for/*` 等链接 **0 个 404** | ❌ 红（etsy 已 404） | **Claude** · GPT 列 URL 清单 |
| G5 | 首屏一句 ICP 非工程腔 | ❌ 偏红 | **Codex** |
| G6 | 3 张真玩具图 live + 1 次失败退分 有记录 | ❌ 未跑 | **任何人手测** · GPT 写验收表 |
| G7 | `npm run build` + lint 绿；生产无 devTopup | ⚠ | **Claude** |
| G8 | Pricing = Coming soon，无 Stripe | ✅ 绿 | 保持 |
| G9 | health softLive + FAL | ✅ 本机绿 | 部署时老板 env |

**公开 `pikbo.ai`：G1–G7 全绿才 GO。**  
未绿之前：**禁止** 对公域分享、禁止「周日一定上」话术。  
可选：仅 **Vercel 预览 URL 内测**（不绑主域、不宣传）。

---

## 现在立刻干（优先级死序）

1. **GPT** 出 NO-GO 规格 + 导航/预设白名单 + 验收表（本文 GPT 块）  
2. **Codex** 按规格改全部对外诚实文案（本文 Codex 块）  
3. **Claude** 按规格砍导航、压预设、修 404、懒加载视频（本文 Claude 块）  
4. **Grok** 合流 + 盯板 + 老板 GO 简报  
5. 手测 G6 → 全绿 → 才谈 `docs/LAUNCH.md` 部署  

---

## GPT（产品 / Codex 同账号时先跑规格）

**分支：** `agent/gpt/go-no-go-soft` · commit `[gpt]`  
**禁止：** 改 `app/api/**`、session、credits 引擎；禁止重开 Stripe。

```text
【紧急 · NO-GO 公开上线 · GPT 规格 · 立刻做】

git pull origin main
git checkout -B agent/gpt/go-no-go-soft

必读：
- docs/BRUTAL_EXPERT_ROAST_2026-07-23.md
- docs/prd/SOFT_LAUNCH.md
- docs/DISPATCH.md（本文件）
- docs/ROLES.md

交付（docs only，今天推完）：

1) docs/prd/GO_NO_GO.md
   - 公开上线 = NO-GO 的理由（引用 roast 证据）
   - G1–G9 验收表：每条 Pass 标准 + 如何测 + 负责人
   - 「内测预览 URL」vs「pikbo.ai 公开」两档定义

2) docs/prd/SOFT_NAV_AND_PRESETS.md
   - Soft 期 **允许露出的导航** 白名单（建议 ≤6 主入口）
   - 必须隐藏/降级的：Models Soon、假 Community、空 Cinema/Batch 等（你定精确列表）
   - 首页主推 **恰好 8 个** 预设 slug 白名单 + 必须下架 shared-loop 墙规则
   - 页脚/内链 **允许 URL 清单**；404 一律删或补页（列决策，实现归 Claude）

3) 更新 docs/prd/SOFT_LAUNCH.md
   - 增加「公开 GO 门槛」一节，指向 GO_NO_GO.md
   - 原「周日无条件上」改为「门槛全绿后上」

4) 更新 docs/STATUS.md：任务 G1–G7 状态
5) docs/HANDOFF.md 顶部写一段交接

完成后：commit [gpt] + push + 在 DISPATCH 或 HANDOFF 写「Claude 可开工」
```

---

## Codex（文案车道 · 与 GPT 可同人串行：规格后立刻文案）

**分支：** `agent/gpt/shell-honesty-copy` · commit `[gpt]`  
**禁止：** API/session/credits；大布局 CSS 重构；假 UGC 数字。

```text
【紧急 · 壳诚实文案 · Codex · GPT 规格合入后立刻】

git pull origin main
# 若 GPT 已 push：merge origin/agent/gpt/go-no-go-soft 或等 main
git checkout -B agent/gpt/shell-honesty-copy

必读：docs/prd/GO_NO_GO.md + SOFT_NAV_AND_PRESETS.md（GPT 交付后）
若尚未合入：先做不依赖白名单的文案，白名单到了再对齐。

改这些（presentation only）：
1) 首页首屏 ICP 一句定死（玩具图→5s 片，free Mini，no card）— 去 Seedance-ready/when live 工程腔
2) meta description / OG 同步
3) Lab / Community / Feed：一律 Official demos / PIKBO Lab，禁止「community of users」暗示
4) Models / 空门入口：若仍可见，文案必须 Preview/Soon 且不承诺可用
5) Pricing 保持 Coming soon；扫全站 unlimited / guaranteed conversion
6) Library：this browser only

验收：eslint 相关文件；grep 禁用词；更新 HANDOFF
commit [gpt] + push
```

---

## Claude（工程 · 止血实现 · 与 GPT 并行可先砍已知空门）

**分支：** `agent/claude/shell-triage` · commit `[claude]`  
**禁止：** Stripe；假多模型；不扩 scope 做卖家包。

```text
【紧急 · 壳止血 · Claude 写代码 · 立刻】

git pull origin main
git checkout -B agent/claude/shell-triage

必读：docs/BRUTAL_EXPERT_ROAST_2026-07-23.md · docs/DISPATCH.md
GPT 白名单到了以白名单为准；未到先按下列默认：

默认导航主入口仅：
  Explore(/) · Create(/create) · Effects(/effects) · Lab(/community 改展示名) · Pricing · Generate
其余：More 菜单或软隐藏，禁止顶栏装完整套件。

P0 代码：
1) AppShell / 移动底栏：砍空门；Models 不进主栏
2) 首页 HfExploreHome / PresetsWall：主推最多 8 卡；禁止同一 demo 片刷 10+ 次墙
3) 全站链接审计：/for/* 等 404 → 删链接或补最小页（优先删坏链）
4) 视频：preload=metadata；视口外不 autoplay；同时播 ≤2
5) production 门禁：devTopup 生产必须 false
6) npm run lint + build 绿

push 后 @Grok 合流。不要等「完美视觉」。
```

---

## Grok（本角色）

- [x] 裁定 NO-GO + roast 证据  
- [x] 派 GPT / Codex / Claude  
- [ ] 合入 shell-triage + copy  
- [ ] 老板 GO 简报（全绿才改口「可以上」）  
- 增长/卖家包：**本周冻结**，不挡止血  

---

## Cross requests

| From | To | 请求 | 状态 |
|------|-----|------|------|
| Grok | GPT | 24h 内交 GO_NO_GO + 导航/预设白名单 | **OPEN · 紧急** |
| Grok | Codex | 规格后诚实文案 | **OPEN · 紧急** |
| Grok | Claude | 壳止血代码 | **OPEN · 紧急** |
| GPT | Claude | 白名单合入后严格按表砍 | 等 GPT |
| 全体 | 老板 | **在 G1–G7 绿之前不要绑 pikbo.ai 公开宣传** | **ACTIVE** |

---

## 给老板的一句话

> **现在不够资格公开上线。**  
> 不是 Stripe 的问题，是 **空门 + 假预设墙 + 断链 + 未手测**。  
> GPT/Codex/Claude 已派紧急任务；全绿再上。内测可用预览 URL。
