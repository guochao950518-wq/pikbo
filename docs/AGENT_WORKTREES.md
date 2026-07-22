# 多 Agent 目录隔离（防止「活干没了」）

**老板：Claude 做 UI 设计很重要。禁止再在同一目录里抢切分支。**

---

## 根因（为什么会消失）

1. **只有一个工作目录** `/Users/x/claude/pikbo`  
2. Grok / Claude / Codex **轮流 `git checkout` 不同分支**  
3. 磁盘上只能显示 **当前 checkout 的那个分支**  
4. Claude 的 UI 在 `agent/claude/home-hf` / `ui-quality` 上；目录被切到 `main` 后，打开文件夹就像「改动消失」  
5. 未 commit 的改动在切分支时还可能被覆盖/ stash 掉  

**活没有从 git 历史消失**，是 **看错了目录/分支**。

---

## 固定地图（必须遵守）

| 角色 | 磁盘路径 | 只允许的分支 | 用途 |
|------|----------|--------------|------|
| **Grok / Codex 引擎** | `/Users/x/claude/pikbo` | `main` 或 `agent/gpt/*` / `agent/grok/*` | API、积分、合流 |
| **Claude 设计** | `/Users/x/claude/pikbo-claude-ui` | **`agent/claude/home-hf` 仅此** | 首页/UI 审美 |

```bash
# 查看
git worktree list
# /Users/x/claude/pikbo            → main
# /Users/x/claude/pikbo-claude-ui  → agent/claude/home-hf
```

---

## Claude 开工（整段粘贴）

```text
重要：你的设计仓库是独立 worktree，不要用 /Users/x/claude/pikbo 主目录。

cd /Users/x/claude/pikbo-claude-ui
git status
# 必须显示：On branch agent/claude/home-hf

每完成一小段：
  git add <files>
  git commit -m "[claude] …"
  git push origin agent/claude/home-hf

禁止：
- git checkout main
- 在 /Users/x/claude/pikbo 里改 UI
- 再建一个临时 worktree 然后丢掉
- 改 app/api、lib/session|pricing|contracts|credits

dev：
  npm run dev   # 可改端口 3001：npm run dev -- -p 3001
```

---

## Grok 规则

- 主目录保持 **`main`**（或短暂 gpt/grok 分支）  
- **不要** `git checkout agent/claude/*` 占用主目录超过几分钟  
- 合流 Claude：`git fetch && git merge origin/agent/claude/home-hf`（冲突时优先保留视觉，契约以 main 引擎为准）  
- 需要看 UI 时去 **worktree 路径**，不要切主目录分支  

---

## Codex 规则

- 只在 `/Users/x/claude/pikbo` · `agent/gpt/*`  
- 不进 `pikbo-claude-ui`  

---

## 恢复「丢失」的 UI

```bash
# 设计仍在这个分支上
git fetch origin
git log origin/agent/claude/home-hf --oneline -10

# 打开固定 worktree
cd /Users/x/claude/pikbo-claude-ui
git pull origin agent/claude/home-hf
```

若 worktree 被误删：

```bash
cd /Users/x/claude/pikbo
git worktree add /Users/x/claude/pikbo-claude-ui agent/claude/home-hf
```

---

## 单一设计主分支

| 分支 | 角色 |
|------|------|
| **`agent/claude/home-hf`** | **Claude 唯一设计主分支**（含 UI quality + HF home） |
| `agent/claude/ui-quality` | 旧 lane，已并入 home-hf 历史；新工作不要只推这里 |
| `main` | 生产；Grok 合流后才进 |

PR：把 home-hf 开/更新 PR 到 main，标题 `[claude] design home-hf`。
