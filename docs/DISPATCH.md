# DISPATCH — 第一性原理 · 五步工作法

**Last human intent (2026-07-23):**  
按马斯克第一性原理 + 五步工作法落实网站：需求不蠢 → 删 → 简 → 快 → 最后自动。  
权威文档：`docs/FIRST_PRINCIPLES.md`

**协调：** Grok  
**质量：** 不假 live、不假无限、build 绿  

---

## 五步进度

| Step | 含义 | 状态 |
|------|------|------|
| 1 需求 | 产品 = 玩具图→短视频；非 HF 全套 | ✅ 已写死 |
| 2 删除 | 主 nav 只留关键路径；套件进 More | ✅ 本轮 |
| 3 简化 | Mini free / 契约 / 1·5·15 积分 | ✅ |
| 4 加速 | 本机 live ✅；**公网 = 老板阻塞** | ⏳ T7 |
| 5 自动 | preflight + critical-path smoke | ✅ 脚本；CI 次要 |

---

## Now（只排关键路径）

| ID | Task | Owner | Status | Notes |
|----|------|-------|--------|-------|
| FP0 | FIRST_PRINCIPLES 文档 + nav 降级 + Mini 文案 | Grok | done | 本轮 |
| FP1 | `npm run critical-path` 绿 | Grok | doing | scripts/critical-path.sh |
| T7 | Vercel + 域名 pikbo.ai | **老板** | blocked | `docs/LAUNCH.md` |
| T5 | Auth + durable credits | — | todo | **挡真 Stripe** |
| T6 | ffmpeg 硬水印 | — | todo | soft 不挡；文案已写 on-player |

---

## 冻结（Step 2 删除令）

- 不新开 HF 大装修 / 大重写合流  
- 不主推 Cinema / Apps / Models / 假社区内容  
- 不生产 Stripe 收款（等 T5）  
- Claude 省额度：无新大页  
- Codex：只允许文案对齐 `lib/pricing.ts`，不改 API  

---

## 关键路径（唯一）

```text
Home → Create → 出片 → Pricing
SEO /effects /for /toys 只为喂 Create
```

---

## 给 Codex / Claude 的开工口令

```text
git pull origin main。
读 docs/FIRST_PRINCIPLES.md。
只做关键路径：Home/Create/出片/Pricing 相关文案或 SEO 质量。
禁止新套件页、禁止改 generate 契约。
做完 push，Grok 合流。
```

---

## 老板 30 分钟（Step 4 真加速）

1. 按 `docs/LAUNCH.md` 部署 Vercel  
2. Env：`SESSION_SECRET` + `FAL_KEY`  
3. 域名 pikbo.ai  
4. 公网 `/create` 上传一张手办图验收  
