# 总控 — 地基期（老板：先地基，后出片）

**更新：** 2026-07-23  
**协调：** Grok  

## 老板原话

> 先把地基做好，不管套壳还是自建。出片是水到渠成的。

## 冻结（直到地基 DoD）

- ❌ 新 Explore / 战役条 / 新套件模块  
- ❌ 为好看大改视觉主题  
- ❌ 假 live、假 UGC、假无限量  

## 地基真相源

→ **`docs/FOUNDATION.md`**

## 分工

| Agent | 只做地基 |
|-------|----------|
| **Grok** | session / credits / generate 契约 / 配置 / 合流 |
| **Codex** | 文案数字对齐 pricing；不改 API |
| **Claude** | presets/FAQ 数据质量；不扩壳 |

## 当前 Grok 队列

1. [x] FOUNDATION.md + contracts.ts  
2. [x] generate 响应永远含 `demo`  
3. [x] README 积分与代码一致  
4. [ ] 可选：production 缺 SESSION_SECRET 时 health 标 degraded  
5. [ ] 地基稳后再开 FAL 出片验收  

## 给 Codex/Claude（若还在跑）

```text
git pull origin main。地基期：只读 docs/FOUNDATION.md。
不要堆新 UI 模块。有额度：对齐文案/FAQ 到 lib/pricing 数字即可。
```
