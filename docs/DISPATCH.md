# DISPATCH — 世界级潮玩视频站（非垃圾标准）

**老板目标：** 世界上最好的潮玩图→视频站；谷歌流量暴涨；订阅路径指向 **日入 $60k**（长期）。  
**战略全文：** `docs/MOONSHOT_WORLD_CLASS.md`  
**门禁：** 公开域名仍要 `docs/prd/GO_NO_GO.md` 绿；**但交付标准从「凑合 soft」升级为 W1–W5。**

**Grok 裁定：** 空壳 HF 导航 = 废物。只做 **玩具 job 全球第一**。

---

## 钱的反推（全员对齐）

- $60k/天 ≈ $1.8M/月 → 约 **3–9 万付费用户**（看 ARPU）或更少高价卖家。  
- 现在：**$0 公开收入能力**；阶段 **S0 止血 → S1 soft → S2 paid**。  
- 细节：`MOONSHOT_WORLD_CLASS.md` §0–§3。

---

## 本周优先级（死序）

```text
W1 出片身份稳 → W3 真片证明墙 → W5 信任 → W2 Seller OS → W4 SEO 收割
     ↑ 全部服务：上传玩具图 → 可发/可卖片 → 愿付费
```

公开 GO 表（G1–G7）仍有效；**绿了只代表「不丢人公开」= S1，不是日入 6 万。**

---

## GPT — 立刻（世界级产品规格）

**分支：** `agent/gpt/world-class-prd` · `[gpt]`

```text
【世界级 · 非垃圾 · GPT】

git pull origin main
git checkout -B agent/gpt/world-class-prd

必读：docs/MOONSHOT_WORLD_CLASS.md · docs/BRUTAL_EXPERT_ROAST_2026-07-23.md
· docs/prd/SELLER_PACK.md · docs/growth/DIFFERENTIATION.md · docs/UNIT_ECONOMICS.md

交付：
1) docs/prd/WORLD_CLASS_PIKBO.md
   - ICP 四层：藏家 / Etsy / Whatnot / 店主 — 各 1 条主路径用户故事
   - 世界级 Create IA（三步内完成）
   - Seller OS 旗舰规格（升级 SELLER_PACK，状态机+积分+失败）
   - Recipe 质量 Pass 标准 + 主推 12 个 slug 定义
   - 付费阶梯「高 ARPU 卖家」草案（标注需经济复核，不直接改代码数字）

2) docs/prd/SEO_INTENT_50.md
   - 50 个搜索意图：slug、H1 搜索原话、绑定 recipe、内链、验收

3) 完善 docs/prd/GO_NO_GO.md + SOFT_NAV_AND_PRESETS.md（若未完成）
   - 导航白名单服务 W，禁止套件门面

禁止：app/api 大改；假 HF 模块清单。
commit [gpt] + push + HANDOFF「Claude 可按 WORLD_CLASS 开工」
```

---

## Codex — 立刻（语言与转化 · 卖家 ROI）

**分支：** `agent/gpt/world-class-copy` · `[gpt]`

```text
【世界级文案 · Codex】

git pull origin main
git checkout -B agent/gpt/world-class-copy

必读：MOONSHOT_WORLD_CLASS.md W 表 · GO_NO_GO G3/G5

交付（presentation）：
1) 首屏 ICP 世界级一句（结果导向，非 Seedance 工程腔）
2) Pricing：卖家 ROI 叙事（一条可上架视频 vs 订阅）— 无 guaranteed sales
3) Lab = Official demos；零假 UGC
4) 至少 10 个 effects/for 页 H1+FAQ 改成搜索原话（对照 SEO_INTENT 若已有）
5) meta/OG 全站统一买家语言

禁止：API/credits 引擎；unlimited。
commit [gpt] + push
```

---

## Claude — 立刻（旗舰体验 · 能打的产品）

**分支：** `agent/claude/world-class-create` · `[claude]`

```text
【世界级实现 · Claude】

git pull origin main
git checkout -B agent/claude/world-class-create

必读：MOONSHOT · BRUTAL roast · 已有 shell-triage on main

P0 代码：
1) Create 旗舰：手机 390 单手完成 上传→选 recipe→生成→结果；
   失败/退款/demo|live 电影级清楚（对齐 SOFT_LAUNCH + WORLD_CLASS 到了跟规格）
2) 首页证明墙：只展示真独特片；主 CTA 唯一 Generate/Try free
3) Seller OS MVP：按 SELLER_PACK/WORLD_CLASS 能开则开最小三件套
4) 性能：视频墙不拖死；保持 preload metadata + 并发限制
5) 保持无空门主导航

禁止：Stripe 真收；假多模型；再堆顶栏。
lint+build 绿；commit [claude] + push
```

---

## Grok — 本席

- [x] Moonshot 反推 + 世界级标准  
- [x] 重写 DISPATCH  
- [ ] 合流 Claude/GPT/Codex 世界级分支  
- [ ] 每周毒舌：是否仍像垃圾  
- [ ] 真片资产清单 / 增长实验设计  
- **冻结：** 再抄 HF 套件模块  

---

## Cross

| From | To | 请求 | 状态 |
|------|-----|------|------|
| 老板 | 全员 | 日入 6 万级野心 | **对齐 moonshot，不许降级成套壳** |
| Grok | GPT | WORLD_CLASS + SEO 50 | **OPEN** |
| Grok | Codex | 买家语言 + ROI pricing | **OPEN** |
| Grok | Claude | Create 旗舰 + 证明墙 | **OPEN** |
| 全员 | 老板 | 真片预算、fal、部署、手测 | **需要** |

---

## 粘贴入口

完整粘贴块也可写在：`docs/PASTE_WORLD_CLASS.md`（见同提交）。

## 给老板

> 三个人可以有潜力，前提是 **标准是世界级潮玩 OS，不是 HF 皮。**  
> 日入 6 万是 S4；我们现在用 S0/S1 的活 **按 S4 的标准做。**  
> 再做空壳 = 继续狗屎。
