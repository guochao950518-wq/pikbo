# 卖家三件套（Grok 增长草案 → 需 GPT 写 PRD）

**给 GPT：** 请结构化为 `docs/prd/` 功能规格后再让 Claude 实现。  
**第一性原理：** 卖家要的是「一张图 → 能上架的一组片」，不是再学一个套件。

---

## 用户故事

> 作为潮玩/盲盒卖家，我上传一张手办图，希望一次得到：  
> 1）360° 转台  2）拆盒/揭晓感  3）竖版社交钩子  
> 以便发闲鱼/淘宝/TikTok，而不是手动点三次 Generate。

---

## 建议形态

| 项 | 建议 |
|----|------|
| 入口 | `/create?pack=seller` 或 Shop 计划专属 Batch 模板 |
| 效果链 | `360-spin-showcase` → `blind-box-unboxing` → `paparazzi-flash`（可配置） |
| 积分 | 3 × CREDITS_PER_VIDEO（或 Shop 打包折扣 — **GPT 定规则**） |
| 输出 | Library 三条 + 可选 zip（工程后期） |
| 计划 | Free：不可或仅 demo；Creator：可选；Shop：默认卖点 |

---

## 非目标（本版）

- 真·云端批量队列  
- 自动写商品标题  
- 假 UGC 晒单  

---

## 验收（产品侧）

- [ ] 一次上传跑完三条预设  
- [ ] 每条标 demo/live  
- [ ] 失败单条退分、不拖死整包  
- [ ] 文案不说 unlimited  

---

**交叉请求 → GPT：** 出 PRD `docs/prd/SELLER_PACK.md`（字段、积分、错误态）  
**交叉请求 → Claude：** PRD 齐后实现 Batch 模板  
