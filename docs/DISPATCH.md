# 24 小时冲刺 — 地基完成 · 软上线就绪

**截止：** 自 2026-07-23 起 24 小时内  
**协调：** Grok  
**质量：** 保质保量 — 不假 live、不假无限、build 必须绿  

## 老板要求

> 加快，保质保量在 24 小时内完成。地基先做好，出片水到渠成。

## 24h 完成定义（DoD）

### 必须完成（代码侧）

| # | 项 | 状态 |
|---|-----|------|
| 1 | 地基文档 + 契约 `FOUNDATION` / `contracts` | ✅ |
| 2 | 会话/积分/免费试玩数字一致 | ✅ |
| 3 | generate 统一响应 + demo 本地潮玩片 | ✅ |
| 4 | 定价文案与单位经济对齐 | 本轮合流 |
| 5 | `npm run preflight` / build 绿 | 本轮验 |
| 6 | 软上线清单老板 1 页可执行 | 本轮写 |

### 需要老板 30 分钟（环境）

| # | 项 |
|---|-----|
| A | `.env` / Vercel：`SESSION_SECRET` + `FAL_KEY` |
| B | 按 `docs/LAUNCH.md` 部署 + 域名 |
| C | 上传一张手办图验收一条 |

**代码 24h 内做到「你配 key 就能上」；公网 live 取决于 A–C。**

## 冻结

- 不新开 HF 大装修分支  
- 不硬合 `product-foundation` / `higgsfield-product-clone` 大重写  
- Claude 省额度：无新大任务  

## 给还在跑的 Codex

```text
git pull origin main。24h 地基冲刺。
只修定价/转化文案对齐 lib/pricing，不改 API。
做完 push，Grok 合流。
```
