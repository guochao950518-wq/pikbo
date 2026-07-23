# 通宵冲刺 — 老板睡觉 · 三 agent 不许停

**状态：** ACTIVE（2026-07-23 夜 · 老板已真睡）  
**协调：** Grok · 第一性原理 + 五步法  
**目标：** 世界上最好的潮玩图→片站点：出片稳、审美硬、数字诚实、可部署  

**老板信条：** 相信 Grok 扛引擎与合流；Claude 设计；Codex 文案。不许偷懒。  


---

## 硬规矩

| Agent | 目录 | 分支 | 节奏 |
|-------|------|------|------|
| **Claude** | `/Users/x/claude/pikbo-claude-ui` | `agent/claude/home-hf` | 每段 commit + **立刻 push** |
| **Codex** | `/Users/x/claude/pikbo` | `agent/gpt/*` | 每段 push；Grok 合流 |
| **Grok** | `/Users/x/claude/pikbo` | `main` | 合流 + 引擎 + 不抢 UI |

**禁止切别人的目录/分支。** 见 `docs/AGENT_WORKTREES.md`。

---

## 通宵任务板

### Claude（设计 · 最重要视觉）

1. HF 顶栏 / 视频墙密度 / 卡片 hover 继续打磨  
2. 手机 390px 首屏只出视频、少字  
3. **每 30–60 分钟** `git push origin agent/claude/home-hf`  
4. 未提交改动先 commit，别留 uncommitted 过夜  

### Codex（文案 · 诚实）

1. [x] 扫剩余 overclaim（Explore / PIKBO Lab / trust 条）  
2. [x] FAQ / 空态与 Mini Free 一致  
3. [x] wave2 honesty 已进 main（Lab labels · Mini trial）  
4. 下一波：pricing FAQ residual + any post-merge drift  

### Grok（引擎 · 生产）

1. [x] merge Codex wave2 honesty  
2. [x] 合流 Claude home-hf（community 4-col）  
3. [x] generate/image: MIME guard · Retry-After · PROVIDER_BALANCE/RATE codes · resolution in success  
4. [x] health ready ladder · library import/export + live/demo filter + richer meta  
5. [x] shared `generateClient` · Batch retry on 429 · Landing/Create aligned · image delete/demo · engine-smoke  
6. [x] honesty: cached demos **0 credits** (generate+image); client no longer blocks out-of-credit demo; entitlements probe on health  
7. [x] softLive: IP+session rate limit · in-flight lock · /api/me mode · softlive-checklist  
8. [x] prompt template always kept · library fal aging badge · checkout rate limits  
9. [x] batch free/live honesty · invoice webhook idempotency · image checkCredits parity  
10. [x] meClient · settings mode honesty · sample stills validate · health HEAD · preflight stills  
11. [x] merge Claude media-rich home promo · profile/landing meClient · promo honesty  
12. [x] merge Claude logo + feature cards · Logo useId · confirm idempotent · toy identity lock  
13. 下一拍：Claude/GPT 新推就合  

### 老板醒来验收

- [ ] `main` 最新  
- [ ] `/create` 能出片或诚实 demo  
- [ ] 首页视频墙像 App  
- [ ] 定价 1 / 5 / 15 + Mini  
- [ ] `docs/LAUNCH.md` 仍是公网下一步  

---

## Grok 本拍状态（3 行）

- Merged Claude logo + feature-card depth; fixed multi-Logo SVG gradient id clash.  
- Confirm idempotent + identity lock on `4a53976`.  
- smoke+typecheck+lint green · **pushed main**. Next: Claude/GPT when pushed.

---

## 复制口令

### Claude（设计 worktree）

```text
通宵不许停。只在固定目录：
cd /Users/x/claude/pikbo-claude-ui
git checkout agent/claude/home-hf
git pull origin agent/claude/home-hf

每完成一块 UI：
git add -A && git commit -m "[claude] …" && git push origin agent/claude/home-hf

禁止 checkout main；禁止用 /Users/x/claude/pikbo。
读 docs/OVERNIGHT.md + AGENT_WORKTREES.md。
继续 HF 审美：顶栏、视频墙、hover、移动端。干到天亮。
```

### Codex

```text
通宵继续。cd /Users/x/claude/pikbo && git pull origin main
git checkout -B agent/gpt/overnight-copy
扫全站假/旧数字与 overclaim；只改文案。
禁止 app/api、session/credits 逻辑、Claude UI 目录。
commit [gpt] + push。读 docs/OVERNIGHT.md。
```

### Grok（自己）

```text
主目录 main：merge 一切绿的 agent 分支；加固 generate/library/health；
不抢 Claude 视觉。定时自检 DISPATCH。
```
