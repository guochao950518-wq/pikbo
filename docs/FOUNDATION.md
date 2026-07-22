# Pikbo 地基（Foundation）— 先于装修、先于出片热闹

**老板指令（2026-07-23）：**  
先把地基做好。套壳或自建都可以，**地基稳了，出片是水到渠成。**  
暂停「再堆 Explore / 战役条 / 新模块」；火力回到 **数据 · 会话 · 计费 · 生成契约 · SEO 页骨架 · 可部署配置**。

---

## 1. 地基五层（唯一真相）

| 层 | 职责 | 主文件 | 状态 |
|----|------|--------|------|
| **L0 配置** | 环境变量、健康检查、部署 | `.env.example` · `docs/LAUNCH.md` · `/api/health` | 文档齐；生产 secret 必配 |
| **L1 会话** | 访客身份、计划、积分 cookie | `lib/session.ts` · `/api/me` | 可用；非多设备 |
| **L2 计费** | 计划定义、扣/退积分 | `lib/pricing.ts` · `lib/credits.ts` · Stripe routes | 已按单位经济收紧；按模型时长计费未做 |
| **L3 生成契约** | 请求/响应/demo/live 统一形状 | `lib/contracts.ts` · `/api/generate` · `/api/image` | **本轮加固** |
| **L4 内容矩阵** | 预设=效果+SEO 页 | `lib/presets.ts` · `for` · `toys` · `guides` · sitemap | 骨架在；养站未开 |
| **L5 壳** | 导航、设计 token | `AppShell` · `globals.css` · `components/ui` | 可用；只修不扩 |

**出片（fal）不是地基，是 L3 上的「水管」。** 水管接口先标准化，再拧开 `FAL_KEY`。

---

## 2. 硬规则（所有 agent）

1. **先改 lib/ 契约，再改 UI。**  
2. **禁止** 为了好看新增整页模块（Cinema/Apps 再扩一轮等）。  
3. **禁止** 假 live / 假 UGC / 假无限量。  
4. Demo 无 `FAL_KEY` 时：返回 **本站 `/demos/*`**，`demo: true`。  
5. Free：10 积分 ≈ 1 次 · 5s · 480p · 水印。  
6. 改积分/计划：只动 `lib/pricing.ts`，并同步 README + 估算器。  
7. 提交前缀 + 不 `git add -A`。  

---

## 3. 生成 API 契约（L3）

### Request (`POST /api/generate`)

```ts
{
  effect: string;       // preset slug
  image: string;        // data:image/...
  extra?: string;
  duration?: number;    // free forced to 5 server-side
  aspectRatio?: string;
  model?: "seedance-2" | "seedance-fast";
  resolution?: "480p" | "720p";
  seed?: number;
}
```

### Response（永远这个形状）

```ts
{
  videoUrl: string;
  demo: boolean;        // true = no live model call
  watermark: boolean;
  model: string;
  duration: number;
  aspectRatio: string;
  session: PublicSession;
  error?: string;
  code?: "INSUFFICIENT_CREDITS" | ...
}
```

失败：扣费后失败必须 **refund**（已有）。

---

## 4. 地基完成定义（Definition of Done）

| 项 | Done 标准 |
|----|-----------|
| 会话 | 新访客有 id/plan/credits；free 上限 clamp；`/api/me` 一致 |
| 计费 | PLANS 与 UI 文案一致；失败退积分 |
| 生成契约 | 类型在 `lib/contracts.ts`；demo/live 字段齐全 |
| 内容 | 加 preset 自动出 SEO 页 + sitemap |
| 配置 | `.env.example` 与 README 数字一致；health 暴露 fal/stripe 布尔 |
| 构建 | `npm run preflight` 绿 |

**不在地基 DoD：** 真 fal 出片、公网域名、UGC、多模型。

---

## 5. 分工（地基期）

| Agent | 只做 |
|-------|------|
| **Grok** | L0–L3 契约、session/credits/generate、合流 |
| **Codex** | 文案与定价页**对齐**地基数字；不改 API |
| **Claude** | presets/for/toys **数据与 FAQ 质量**；不扩壳 |

---

## 6. 下一步地基任务（有序）

1. ~~统一 generate 响应类型~~  
2. ~~README / 文档与 pricing 数字对齐~~（Free Mini / 1·5·15）  
3. ~~FAL_KEY 本机 live 验收~~（2026-07-23）  
4. **按 `docs/FIRST_PRINCIPLES.md` 五步：** 删导航噪音 → 公网部署（老板 LAUNCH）→ 再 T5 auth  
5. 可选：`costForJob({model,duration,resolution})`（仍 flat 10 可上 soft）  
6. 生产：SESSION_SECRET + FAL_KEY 必配  

**作战令：** 物理学只要求图进片出、成本盖住、公网可及。其余先删。  
