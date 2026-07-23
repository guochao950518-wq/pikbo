# 潮玩垂直差异化与增长（Grok · 策略草案）

**状态：** 草案 v2 · 2026-07-24 竞品地图校准  
**实现：** Grok/Claude · 规格：GPT  
**第一性原理：** 用户要「自己的玩具能动、能发、能卖」；我们不拼通用 AI 视频商城。  
**详图：** `docs/research/COMPETITOR_LANDSCAPE_2026.md`

---

## 1. 定位一句话

> **Pikbo = 潮玩版 Higgsfield Generate + Yiha Lego。**  
> Generate 工作台（`/create`）+ Modules 积木工作流（`/modules`）；  
> 不是通用多模型 OS，不是妙呀式从零造 IP；是 **已有 SKU 的短视频运营套件**。

---

## 1b. 三角定位（2026 校准）

| 玩家 | 卖点 | Pikbo 关系 |
|------|------|------------|
| HF / OpenArt / Leonardo / Krea | 多模型创意 OS | 学壳，不拼模型数 |
| **妙呀** | 文 → 世界观/三视图/商品图 IP | **上游互补**；不硬刚 |
| **Meshy 等** | 图 → 可打印 3D | **后期出口**；不自研 |
| **Pikbo** | 自有静图 → listing/unbox/social 片 | **下游卖货/发帖** |

---

## 2. 与通用站的差异（必须守住）

| 维度 | 通用 AI 视频站 | Pikbo |
|------|----------------|-------|
| 素材 | 人脸/风景/万能 | **自有玩具静图** |
| 效果 | 爆炸/变装/电影 | **转台、拆盒、货架、上架片** |
| 信任 | UGC 海量 | **官方 Lab + 诚实 demo/live** |
| 定价 | 假无限 | **1 / 5 / 15 可算清** |
| SEO | 泛词 | **effects / for / toys 长尾** |
| 一致性 | Soul/Character/LoRA | **Toy Identity / SKU 锁**（演进中） |

---

## 3. 功能脑暴（优先序）

### P0（已有/加固）
- 图→片 Seedance Mini 试玩  
- 效果预设 + SEO 页  
- Library 本机历史  

### P1（增长杠杆 · 需 GPT 出 PRD）
1. **卖家三件套一键包**（转台 + 拆盒 + 主图）— Shop 钩子  
2. **「用我的图 remake Lab」路径** 再缩短（首页点片 → 已带 effect）  
3. **效果页同页工具** 继续 SEO 转化  

### P2（社区/病毒 · 要身份）
1. 真实 UGC 墙（需登录 + 存储）  
2. 「本周潮玩 challenge」话题标签  
3. 分享水印带 `pikbo.ai/?from=`  

### P3（以后）
- 多模型货架（仅真 key）  
- 硬水印 ffmpeg  
- 批量 agent 深化  

---

## 4. 增长策略（简）

1. **冷启动：** SEO 工具页（哥飞路径）+ 潮玩社群案例片  
2. **循环：** 免费 1 次 Mini → 定价页有限额度 → Shop 卖家包  
3. **内容：** Lab 片只标 Lab；用户片仅登录后  
4. **不做：** 假 UGC、假日生成量、假多模型 live  

---

## 5. Prompt 工程方向（给 Claude 落地）

- 所有 preset `promptTemplate` 保留 **玩具身份锁定**（不改脸成真人）  
- 用户 extra **附加**不覆盖模板 — **已落地** `lib/promptBuild.ts`（cap 400 + identity lock 兜底）  
- 卖家类预设加：listing / 白底 / 360 商品语言  
- 藏家类：shelf / unbox / display case 情绪  

---

## 6. 交叉请求

- **→ GPT：** 把 P1「卖家三件套」写成 PRD + 积分消耗规则  
- **→ Claude：** soft-launch 主路径工程化；P1 等 PRD  

---

*Grok 维护策略文；改商业数字以 GPT + `lib/pricing.ts` 为准。*
