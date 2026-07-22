# DISPATCH — 三车道 + 防丢活

**Last human intent:** Claude 改 UI 很重要；worktree 活总「消失」——已查清是**共用目录切分支**，不是 git 删了代码。

**协调：** Grok  

完整说明：`docs/AGENT_WORKTREES.md`

---

## 物理隔离（强制）

| Agent | 路径 | 分支 |
|-------|------|------|
| **Claude 设计** | `/Users/x/claude/pikbo-claude-ui` | `agent/claude/home-hf` **锁定** |
| **Grok 引擎** | `/Users/x/claude/pikbo` | `main` |
| **Codex 文案** | `/Users/x/claude/pikbo` | `agent/gpt/*` |

**禁止** 在 Claude 的 worktree 里 `checkout main`。  
**禁止** Grok 长时间占用主目录切到 `agent/claude/*`。

---

## 车道

| Agent | 做 | 不做 |
|-------|----|------|
| **Claude** | 视觉、首页 HF 审美、布局、动效 | API / session / pricing 逻辑 |
| **Codex** | 转化文案、数字诚实 | 视觉骨架、API |
| **Grok** | 出片水管、合流、限流、部署协助 | 抢 UI 大改 |

---

## 状态

| 项 | 状态 |
|----|------|
| Claude UI `home-hf` | **已 merge main** (PR #13) · worktree 继续迭代 |
| Codex C1–C2 | 已 merge main |
| Codex C3–C5 | **done · `agent/gpt/c3-c5` 待 Grok 合流** |
| Grok | 修 tsc、CI、Library 下载/导出、generate 读图校验 · 主目录 `main` |

---

## 给 Claude 的口令（粘贴）

```text
你的设计目录固定为：
  cd /Users/x/claude/pikbo-claude-ui
  分支必须是 agent/claude/home-hf

不要用 /Users/x/claude/pikbo（那是 Grok 的 main）。
每改完就 commit + push origin agent/claude/home-hf。
禁止 git checkout main。
禁止改 app/api 与 lib 计费/生成契约。
读 docs/AGENT_WORKTREES.md。继续 UI 设计。
```

---

## 给 Codex 的口令

```text
cd /Users/x/claude/pikbo && git checkout main && git pull
C3–C5 已完成；等待 Grok 合流 `agent/gpt/c3-c5`。
后续只处理 DISPATCH 新分配给 Codex 的任务。
禁止进 /Users/x/claude/pikbo-claude-ui。
```

---

## Grok 合流 Claude 时

```bash
cd /Users/x/claude/pikbo
git checkout main && git pull
git fetch origin
git merge origin/agent/claude/home-hf
# 冲突：视觉听 Claude，契约听 main
git push origin main
```
