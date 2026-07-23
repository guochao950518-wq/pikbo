# 快速拥有 HF Generate + Yiha Lego 的产品功能

**日期：** 2026-07-24  
**对象：** [higgsfield.ai/generate](https://higgsfield.ai/generate) · [yiha.ai/lego](https://yiha.ai/lego)  
**原则：** 合法对标交互与信息架构；**不抄** 文案、片源、商标、源码。  
**结论一句话：** 他们 80% 的「产品感」来自 **货架 + 工作台 + 一键配方 + 结果闭环**，不是来自「接了 10 个模型 API」。

---

## 1. 他们真正卖什么（拆解）

| 表面功能 | 用户感知到的能力 | 底层其实是 | Pikbo 最快等价物 |
|----------|------------------|------------|------------------|
| HF Generate 工作台 | 「专业 AI 导戏台」 | 上传 + 模式 + 预设 + 参数 + 生成 + Library | `/create` + JobIntent + 结果版本 |
| HF Viral Presets / Apps | 「一点就会出片」 | 深链预填配方（effect/ratio/model） | `/effects` + `?effect=` + recipes |
| HF Product / Marketing | 「商品能卖」 | 固定 job 三件套 | Seller Pack + job chips |
| HF Models 墙 | 「随便换模型」 | 多 provider 路由 | **只上 live Seedance**，其余 Soon |
| Yiha `/lego` | 「给 LEGO 的专用工作室」 | **垂直 mini-app 壳** → Create | Toy Workflow mini-apps |
| Yiha Create / Explore | 「灵感 → 重做」 | remix 深链 + credits | Explore remix + credits |

**关键洞察：**  
Yiha 的 `/lego` 不是「多了一条 Lego 模型 API」——是 **垂直场景落地页 + 固定工作流**。  
HF Generate 也不是「一张空白表单」——是 **套件壳里的生产台 + 预设墙**。

---

## 2. 如何「快速拥有」——四层加速法

```text
L1  交互壳（1–2 天）   信息架构 / 货架 / 一键深链 / job 路由
L2  配方资产（持续）   独立真片 + prompt 骨架 + 画幅默认
L3  工作流 mini-app（本轮）  潮玩版 /lego：每个 job 一个 App 入口
L4  Provider 能力（有 key 再做）  多模型 / 音频 / Cinema / 云 Library
```

### L1 · 交互壳（最快、最合法、感知最大）

| 竞品模式 | Pikbo 动作 | 工期 |
|----------|------------|------|
| 套件导航 Generate 居中 | AppShell + `/create` 旗舰 | 已有 |
| 结果优先墙 | Home proof + Explore | 已有，继续加真片 |
| 一键 preset 带走全参 | `?effect=&ratio=&job=` | 已有 + 加强 |
| Job 不是模型名 | `JobIntentBar` | **已上线** |
| 首 clip 清单 | `ActivationChecklist` | **已上线** |
| 失败退分可见 | refund + banner | 已有 |

### L2 · 配方资产（质量飞轮，不是堆菜单）

- 每个主推 recipe **独立 Lab 片**（禁止一片刷多卡）
- prompt 模板 = 潮玩身份锁（颜色/材质/比例）
- 8 条 launch recipes 先打穿，再扩 catalog

### L3 · Mini-app 货架（Yiha `/lego` 模式 · 本轮交付）

竞品：`/lego` = 一个垂直工作流入口。  
Pikbo：**不做假 LEGO 品牌页**，做 **玩具卖家工作流 App 墙**：

| Mini-app | Job | 深链 | 状态 |
|----------|-----|------|------|
| Listing Spin | Etsy/PDP 转台 | `?job=etsy-listing` / effect | live |
| TikTok Hook | 9:16 前 2 秒 | `?job=tiktok-hook` | live |
| Blind-box Drop | 拆盒 reveal | `?job=blind-box-drop` | live |
| Shelf Glam | 陈列/收藏 | `?job=shelf-display` | live |
| Seller Pack | 三件套批量 | `?mode=seller-pack` | live |
| Photo → Clip | 通用工作台 | `/create` | live |

实现：`lib/workflows.ts` + `WorkflowShelf` 挂 Create；`/apps` 与 catalog 对齐。

**这就是「快速拥有 Yiha lego 产品功能」的正确打开方式：**  
同一套 Create 引擎，N 个垂直入口 = 用户以为有 N 个产品。

### L4 · Provider（慢、贵、别假装）

| 能力 | 何时做 | 不做时策略 |
|------|--------|------------|
| Kling / Veo / Sora | 真有 key + 真片证明 | Models 页 Soon，Create 不展示假切换 |
| 云 Library / 账号资产 | Supabase SQL + auth 老板完成 | localStorage 诚实标注 |
| Cinema Elements 全套 | 玩具 identity 锁升级后再议 | `/cinema` stub → Create，不主推 |
| 音频 / lipsync | 独立 provider | Apps SOON，不卖 |

---

## 3. 「看起来像他们」的优先级队列（按 ROI）

### 本周可感知（已做 / 本提交）

1. ✅ Job-to-be-done 芯片（Etsy / TikTok / reveal / shelf / pack）  
2. ✅ 首 clip 激活清单  
3. ⏭ **Workflow mini-app 货架**（Yiha lego 同构）  
4. ⏭ Create 内「Apps · workflows」横滑 + `/apps` 真入口  
5. 诚实模型条：仅 live Seedance 档位  

### 下周（不部署也能打磨）

6. 每个 workflow 独立 proof 卡片（poster + 1 句 job）  
7. Seller Pack 成功后「发帖 checklist」  
8. Library 空状态 → 直接进 workflow  
9. Explore 分类 tab 与 job 对齐（Listing / Unbox / Social）  

### 有 key / 有账号后再做

10. 真多模型切换  
11. 云端 Library  
12. 真 UGC Community remake  

### 明确不做（浪费时间的假对标）

- 假 Cinema 全屏导戏  
- 假多模型 live 切换  
- 抄 HF/Yiha 片源与文案  
- 堆空导航伪装 OS  

---

## 4. 工程配方（可复制）

### 4.1 一个「功能」= 一个深链 + 一个 registry 行

```ts
// 不要新 API；要新 workflow 行
{
  id: "listing-spin",
  label: "Listing Spin",
  href: "/create?job=etsy-listing",
  effect: "360-spin-showcase",
  live: true,
}
```

### 4.2 用户路径对比

| 竞品路径 | Pikbo 等价 |
|----------|------------|
| Yiha → /lego → 工作流 | Home/Apps → Workflow card → Create 预填 |
| HF → Viral Preset → Generate | Effects/Home → Remix → Create |
| HF → Product Video 三步 | Job chip / Seller Pack |
| HF Generate 参数台 | Create 折叠高级项 + 报价条 |

### 4.3 速度公式

```text
感知功能数 ≈ live workflows × 独立真片 × 深链完整度
             ÷ 假入口数（Soon 过多会伤信任）
```

**所以最快路径是：多做 live workflow，少做 Soon 菜单。**

---

## 5. 与老板决策的对齐

| 决策 | 含义 |
|------|------|
| 正式上线 / DNS 暂停 | 不挡产品打磨；本方案纯前端+registry |
| 不合法不做 | 只学模式；媒体与文案自有 |
| 潮玩垂直更深 | mini-app 全是 seller/collector job，不是通用 Cinema |
| G6 PASS 已有 | live 路径可信；workflow 深链到真 Generate |

---

## 6. 验收（本轮）

- [ ] Create 顶栏可见 **Workflow shelf**（≥5 live mini-apps）  
- [ ] 点任一 live workflow → recipe + aspect（或 seller-pack mode）就绪  
- [ ] `/apps` 展示同一 registry，CONFIGURED 可点进真路径  
- [ ] 文档本页写清：L1–L4 与永不假做清单  
- [ ] 无新假模型 live 开关  

---

## 7. 一句话给老板

> **不要重建 Higgsfield / Yiha。**  
> **用我们已有的 Seedance Create，按他们的「货架 + 垂直 App + 一键配方」壳再包一层——一周内用户就会觉得「功能很多」，而且全部合法、可出片。**

---

## 8. 扩展地图（2026-07-24）

老板补充的 OpenArt / Leonardo / Krea / **妙呀** / **Meshy** 等已收入：

→ **`docs/research/COMPETITOR_LANDSCAPE_2026.md`**

要点：结构抄 OS 壳；垂直盯妙呀但不做文生 IP；3D 后置 Meshy 出口；差异化 = 已有 SKU 出片卖货。

*Grok · FAST_FEATURE_PARITY · 2026-07-24*
