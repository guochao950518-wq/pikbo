# DISPATCH — 日班开工（老板已醒）

**时间：** 2026-07-23 日班  
**权威分工：** `docs/ROLES.md`  
**仓库：** https://github.com/guochao950518-wq/pikbo · `main`  
**站：** 本机 softLive 绿（fal live · softLive true · paid false）

---

## 角色（再确认）

| Agent | 今日职责 |
|-------|----------|
| **Claude** | **写代码** — 工程实现、修 bug、按 PRD 落地 |
| **GPT** | **写规格** — Soft-launch PRD、积分商业规则、Generate API 规格 |
| **Grok** | **增长/差异化 + 协调** — 合流、优先级、prompt/玩法建议；不抢主写业务代码 |

**交叉：** 先在下方 Cross 留言 → 对方确认 → 再动手。

---

## 今日目标（第一性原理）

1. **主路径稳：** 首页 → Create 出片 → Library / Pricing  
2. **规格齐：** Soft-launch 有 PRD，Claude 不再猜商业规则  
3. **可演示：** 老板本地 5 分钟能验收  
4. **不硬上：** 无 durable 积分前不宣称完整订阅  

---

## GPT — 立刻（阻塞 Claude 的大功能）

| ID | 交付物 | 验收 |
|----|--------|------|
| **P1** | `docs/prd/SOFT_LAUNCH.md` | **done** · 已在 main |
| **P2** | `docs/business/CREDITS_AND_PLANS.md` | **done** · 已在 main |
| **P3** | `docs/api/GENERATE.md` | **done** · 已在 main |

分支：`agent/gpt/prd-soft-launch` · commit `[gpt]`

```text
【日班 · GPT · docs/ROLES.md】
你是产品与结构，不主力写业务代码。

git fetch && git checkout main && git pull
git checkout -B agent/gpt/prd-soft-launch

立刻写完并 push：
1) docs/prd/SOFT_LAUNCH.md
2) docs/business/CREDITS_AND_PLANS.md  （对照 lib/pricing.ts：Free10≈1 Mini、Creator50≈5、Shop150≈15）
3) docs/api/GENERATE.md  （对照 lib/contracts.ts + 现 generate route 行为）

更新 docs/STATUS.md。交叉需求写 DISPATCH。
不要大改 app/api 实现。
```

---

## Claude — 立刻（工程）

| ID | 交付物 | 验收 |
|----|--------|------|
| **E1** | pull main，认领工程 | typecheck + lint 绿 |
| **E2** | PRD 未到前：修明显 bug / 类型 / Create 主路径体验债 | 小步 `[claude]` commit |
| **E3** | P1 到了：按 SOFT_LAUNCH 实现缺口 | 对照 PRD 验收表 |
| **E4** | 保持 UI+后端一体实现（含视觉） | 不发明积分规则 |

分支：`agent/claude/<topic>` · 目录：`/Users/x/claude/pikbo`

```text
【日班 · Claude · docs/ROLES.md】
你是工程实现主力，写全部代码。

git fetch && git checkout main && git pull
cd /Users/x/claude/pikbo

立刻：
1) npm run typecheck && npm run lint
2) 修任何红；Create 主路径可维护性小改
3) 盯 GPT 的 docs/prd/SOFT_LAUNCH.md — 一出现就按规格实现，别猜商业规则

commit [claude] + push agent/claude/*
禁止：无 PRD 改积分/订阅语义。
```

---

## Grok — 立刻（本角色）

| ID | 交付物 | 状态 |
|----|--------|------|
| **G1** | 日班 DISPATCH + 协调 | **doing** |
| **G2** | 增长/差异化已有 `docs/growth/DIFFERENTIATION.md`；今日补「卖家三件套」一页给 GPT | todo |
| **G3** | 合流 Claude 工程 PR / GPT 文档 PR | waiting |
| **G4** | 老板要部署时带 LAUNCH | standby |

---

## Cross requests

- **2026-07-23 · GPT → Claude · waiting for P1–P3 merge:** After the product specs land, audit the soft-launch UI against them: keep live Stripe checkout unavailable until every gate in `docs/business/CREDITS_AND_PLANS.md` passes, and make cached demo vs live generation states explicit. Do not change plan allowances or API semantics while the specs are under review.

---

## 老板 5 分钟验收

```bash
open http://localhost:3000
open http://localhost:3000/create
open http://localhost:3000/pricing
curl -s http://127.0.0.1:3000/api/health | head -c 400
```

- [ ] 首页视频墙能动  
- [ ] Create 能出 demo 或 live  
- [ ] Pricing 1 / 5 / 15  
- [ ] health `ok` + `live-generate`（有 FAL_KEY 时）  

公网：`docs/LAUNCH.md`（老板 30–60 分钟）  
