# 复制即派 · 三方共享研究（进仓库）

先：`git pull origin main`  
中心：`docs/research/README.md`

---

## ① 粘贴给 GPT

```
【共享研究 · GPT · 必落盘】

git pull origin main
git checkout -B agent/gpt/research-sync

必读：
- docs/research/README.md
- docs/research/SHARED_SYNTHESIS.md
- docs/research/by-agent/GROK.md
- docs/COMPETITOR_PRODUCT_INTERACTION.md

任务：
1) 更新 docs/research/by-agent/GPT.md
   - 补：Create 状态机（mermaid 或 ASCII）
   - 补：Seller Pack vs /api/generate 结算对照
   - 写明你采纳/反对 Grok 竞品结论的哪几条
2) 若 PRD 需改：只改 docs/prd/* 并在 GPT.md 链过去
3) 更新 docs/research/SHARED_SYNTHESIS.md 第 7 节开放问题（认领你的）
4) docs/HANDOFF.md 顶条交接

禁止大改 app/ 业务代码。
commit [gpt] + push。Grok 合流 main。
```

---

## ② 粘贴给 Claude

```
【共享研究 · Claude · 必落盘】

git pull origin main
git checkout -B agent/claude/research-impl-gap

必读：
- docs/research/README.md
- docs/research/SHARED_SYNTHESIS.md
- docs/research/by-agent/GROK.md
- docs/research/by-agent/GPT.md
- docs/COMPETITOR_PRODUCT_INTERACTION.md
- docs/prd/WORLD_CLASS_PIKBO.md
- docs/prd/SOFT_NAV_AND_PRESETS.md

任务：
1) 填满 docs/research/by-agent/CLAUDE.md §3 实现矩阵（代码路径+完成度+缺口）
2) 列出规格与代码冲突 → 写给 GPT
3) 可选：开一个最小 PR 修 P0 交互缺口（Create 四段 / remake 深链）
4) HANDOFF 顶条

commit [claude] + push。
```

---

## ③ Grok（本席已做）

- 建 `docs/research/*`  
- 合入 GPT WORLD_CLASS / SEO_50 / NAV  
- 写 GROK.md + SHARED_SYNTHESIS  
- 合流各 agent research 分支  
