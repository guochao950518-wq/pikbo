# DISPATCH — 协调令 · 禁止偷懒

**From Grok（协调官）· 老板命令：持续干活，不许停**  
**第一性原理：** 图→片、诚实成本、公网可及。删虚荣 → 简 → 快 → 最后自动。

---

## 刚合流（已进 main）

| 谁 | 内容 |
|----|------|
| Claude home-hf | 纯黑+lime、视频墙 denser、community 4-col、create stage |
| Codex wave2 | Lab labels · Mini trial · TrustStrip honesty |
| Grok engine | PROVIDER_* codes · MIME guard · health.ready · library import |
| Grok engine | generateClient shared · Batch 429 retry · Landing parity · engine-smoke |
| Grok engine | cached demo = 0 credits · entitlements probe · health.ready.paid gated |
| Grok engine | softLive: IP rate limit + inflight lock + me.mode + checklist |
| Grok engine | promptBuild + library aging + checkout RL |

---

## 下一波 · 立刻执行（做完再停）

### Claude 设计 · D5+

路径：`/Users/x/claude/pikbo-claude-ui` · 分支：`agent/claude/home-hf`

1. **D5** 首页/顶栏 HF 密度继续（390 首屏视频优先）  
2. **D6** 卡片 hover / 播放态 polish  
3. **D7** 每 30 分钟 `push origin agent/claude/home-hf`

```text
【Grok 协调令 · 禁止偷懒】
老板要求持续生产。上一波设计已 merge main。

cd /Users/x/claude/pikbo-claude-ui
git fetch origin && git checkout agent/claude/home-hf
git merge origin/main
git push origin agent/claude/home-hf

连续做：
1) /community 做成和首页一样密的视频墙
2) /create 工作区黑+lime、大预览，不改 app/api
3) /effects 预设墙 denser + hover 一致
每块：git commit -m "[claude] …" && git push origin agent/claude/home-hf

禁止：checkout main 当工作区；用 /Users/x/claude/pikbo 改 UI；改 API。
读 docs/AGENT_WORKTREES.md。开始写代码，不要只汇报。
```

---

### Codex 文案 · wave2

路径：`/Users/x/claude/pikbo` · 分支：`agent/gpt/wave2-copy`

1. community/explore 假 UGC / 旧数字清扫  
2. effects FAQ 与 Mini + 1/5/15 一致  
3. TrustStrip / Onboarding / 空态 demo vs live  
4. push PR

```text
【Grok 协调令 · 禁止偷懒】
老板要求持续生产。overnight-copy 已 merge。

cd /Users/x/claude/pikbo
git fetch && git checkout main && git pull origin main
git checkout -B agent/gpt/wave2-copy

只做文案：
1) community/explore 假承诺与旧数字
2) effects SEO FAQ 与 Mini free / 1·5·15
3) TrustStrip/Onboarding/空态 demo vs live

禁止：app/api、session/credits 逻辑、大改视觉。
npm run lint
git commit -am "[gpt] wave2 honesty pass"
git push -u origin agent/gpt/wave2-copy

读 docs/DISPATCH.md。开始写代码，不要闲聊。
```

---

### Grok

合流 + 引擎 + typecheck；45 分钟定时冲刺；不抢 UI。
