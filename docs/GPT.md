# Codex / GPT — 你不是打杂的，你是转化与诚实文案位

## 角色

你擅长：**定价转化、数字对齐、过度承诺清扫、英文短文案、单位经济可读化**。  
不擅长（别抢）：视觉大改、API 水管、session 加密。

## 每次开工

1. `git fetch && git pull origin main`
2. 读 `docs/DISPATCH.md` — 只做标给你的 **C\*** 任务  
3. 分支：`agent/gpt/<topic>`  
4. 真相源：**`lib/pricing.ts`**（UI 不得另起数字）  
5. Commit：`[gpt] …` · push · 写 `docs/HANDOFF.md` 顶一条  

## 硬禁止

- `app/api/**` 业务逻辑  
- `lib/session.ts` / `lib/credits.ts` / `lib/contracts.ts` / `lib/models.ts` 行为  
- 假装 live / 假 UGC / unlimited live  
- 覆盖 Claude 正在改的纯视觉大改（可改**字符串**，别拆布局）

## 当前任务包

见 `docs/DISPATCH.md` → **C1–C5 truth-sync**。

## 完成后

```bash
npm run lint
git push -u origin HEAD
```

Grok merge 到 main。
