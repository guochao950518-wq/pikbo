# 总控板 — Grok 协调（老板已授权）

**更新：** 2026-07-23  
**协调人：** Grok（本会话持续管合流、优先级、额度分配）  
**仓库：** https://github.com/guochao950518-wq/pikbo

---

## 老板授权

```
你来管。我不知道各家额度。Claude 紧，Codex 还能干。
三家发挥最大能力把网站建好。
```

---

## 额度策略（今天）

| Agent | 额度体感 | 今天怎么用 |
|-------|----------|------------|
| **Claude Pro** | 易见底 | **停大任务**。已交付 SEO 文案则休息；只允许极短修 bug |
| **Codex Pro 5x** | 相对能扛 | **可继续**，但只接「短、不撞 API」的单；Grok 指定任务 |
| **Grok** | 无 Pro 式可见余额；会话会 compact | **主力工程 + 合流**；长任务我扛 |

**原则：** 能 Grok 做的不烧 Claude；Codex 不做 generate/session；冲突 Grok 解。

---

## 已合并进 main（三家战果）

| 来源 | 内容 | SHA 参考 |
|------|------|----------|
| Claude | presets 潮玩 tagline + COMMON_FAQ | 2374616 一带 |
| Codex | 诚实标签 + UNIT_ECONOMICS | 3ee4b73 |
| Grok | 壳/视频站/UI kit/生成诚实/合流 | 持续 main |

---

## 当前优先级队列（Grok 排期）

### P0 — Grok 做

1. **定价/积分诚实化**（按 `docs/UNIT_ECONOMICS.md`）  
   - 免费额度文案 + credits 数先收紧  
   - Creator/Shop「≈N clips」改为诚实区间（非 50 假繁荣）  
2. **合流** 任何新的 `agent/*` 分支  
3. 生成链路保持扣费/退款 + demo 提示  

### P1 — Codex 仅当还有额度且 Grok 点名

- 定价页/估算器文案对齐新积分（**只改 UI 文案组件**）  
- 不要新开大重写分支  

### P2 — Claude 休息

- L1/L2 已合；**今天默认 stop**  
- 重置后再做 for/toys 挂 COMMON_FAQ  

### 阻塞（要老板）

- `FAL_KEY` 本机配置 → 真出片  
- 是否接受「免费 1 次试玩」政策  
- 上线闸门  

---

## 给还在跑的 Codex（如需要可贴）

```text
Grok 在协调。请：git pull origin main。
若额度紧：push 当前进度后 stop。
若还有额度：只改定价/估算器文案对齐 docs/UNIT_ECONOMICS.md，
不要改 app/api、session、credits 实现。分支 agent/gpt/*，提交 [gpt]。
```

## 给 Claude（建议 stop）

```text
Grok 在协调。你的 L1/L2 已合进 main。
今天请 stop，省额度。明天窗重置后再等 DISPATCH。
```

---

## 老板怎么配合

1. **不用管分工** — 有问题问 Grok  
2. 他们说 limit → 转告我  
3. 配好 `FAL_KEY` 到 `.env.local`（别贴聊天）  
4. 说「合流」或放着我定时收  

---

## 法律 / 协作红线

- 禁止 `git add -A`、假 UGC、假多模型  
- 竞品结构可学，素材不可盗  
