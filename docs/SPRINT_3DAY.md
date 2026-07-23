# 2～3 天打磨冲刺（Soft 上线前）

**老板决定：** 不立刻公网，再打磨 2～3 天。  
**截止：** 自 2026-07-23 起约 72 小时内，达到 **可 soft 上 pikbo.ai**（仍不正式收钱）。  
**验收圣经：** `docs/prd/SOFT_LAUNCH.md` 第 6～9 节  
**分工：** `docs/ROLES.md` — Claude 写代码 · GPT 补规格 · Grok 增长/协调  

---

## 成功长什么样（人话）

陌生人手机打开 pikbo.ai 能：

1. 看懂：这是 **自己玩具图 → 短视频**  
2. 点进 Create，上传图，选效果  
3. 生成前知道：是 **缓存 demo** 还是 **真 Mini 试玩**  
4. 出片或明确错误；不骗「无限 / 云盘 / 已付费」  
5. Pricing 看得见 1/5/15，**买不了真订阅**（或按钮写清 Coming soon）

---

## 三天排期

### Day 1 — Create 主路径（最高优先）

| ID | 谁 | 任务 | DoD |
|----|-----|------|-----|
| D1-C1 | Claude | Create **Preflight 条**：mode / 是否送图给 provider / 模型·秒数·分辨率 / 积分 / 余额 | 生成按钮上方固定可见 |
| D1-C2 | Claude | **所有权确认** checkbox（未勾不能 generate） | 文案短、可本地记住 |
| D1-C3 | Claude | 结果区强制 `Cached demo` / `Live generation` + 禁止云备份暗示 | 对照 PRD §6 |
| D1-G1 | Grok | 验收清单 checklist 同步 DISPATCH；合流 Claude PR | — |
| D1-P1 | GPT | 若文案有歧义：补 `docs/prd/SOFT_LAUNCH.md` 补丁一节「UI 必写句」 | 可选 |

### Day 2 — 诚实定价 + 首屏 + 移动

| ID | 谁 | 任务 | DoD |
|----|-----|------|-----|
| D2-C1 | Claude | Pricing：**无 Stripe 时** Creator/Shop CTA = `Coming soon` / 禁用真 checkout | 生产不可 dev 假升级 |
| D2-C2 | Claude | 首页首屏 **一句 ICP**（谁·问题·结果）+ 主 CTA Generate | 390 不横滚 |
| D2-C3 | Claude | Library 文案固定 **Local Library · this browser** | — |
| D2-G1 | Grok | 哥飞式：列 10 个优先 `/effects` slug 内容加厚建议 | `docs/growth/SEO_PRIORITY.md` |
| D2-P1 | GPT | Soft 上线运维清单（env 表、回滚：拔 FAL_KEY） | `docs/prd/SOFT_LAUNCH_OPS.md` |

### Day 3 — 压测、扫雷、上线包

| ID | 谁 | 任务 | DoD |
|----|-----|------|-----|
| D3-C1 | Claude | 全站扫 PRD §6 禁用词（unlimited / 4K / cloud library…） | lint 或文档勾选 |
| D3-C2 | Claude | 3 张真玩具图手测：成功 + 故意失败看退积分 | 记在 HANDOFF |
| D3-G1 | Grok | 对照 LAUNCH 写「老板 30 分钟上线剧本」最终版 | 更新 LAUNCH 若需要 |
| D3-G2 | Grok | 合流一切绿 PR；typecheck/lint 绿 | main 干净 |
| D3-Boss | 老板 | 本地走通主路径；准备 Vercel env | 点头 soft 上 |

---

## 明确不做（这 3 天）

- Stripe 真收费、登录系统、云 Library  
- 大重写 HF 壳、新套件页  
- 硬合 product-foundation / higgsfield-product-clone  
- 为完美 SEO 外链花时间  

---

## 每日站会（各 agent 自报）

```text
昨天：…  今天：…  卡点：…  分支/PR：…
```

写进 `docs/STATUS.md` 或 commit message。

---

## 复制口令

### Claude

```text
【2～3 天打磨 · 你写全部代码 · docs/ROLES.md + docs/SPRINT_3DAY.md】
git fetch && git checkout main && git pull
git checkout -B agent/claude/soft-launch-polish

严格按 docs/prd/SOFT_LAUNCH.md：
Day1: Create preflight 条 + 所有权 checkbox + 结果标签
Day2: Pricing 无 Stripe 禁用真买 + 首页 ICP 一句 + Library local 文案
Day3: 禁用词扫尾 + 手测 3 图

禁止：Stripe 真收款、登录、大重写。
每完成一块 [claude] commit + push。
```

### GPT

```text
【2～3 天打磨 · 你只写规格 · docs/SPRINT_3DAY.md】
git pull origin main
git checkout -B agent/gpt/soft-launch-ops

写 docs/prd/SOFT_LAUNCH_OPS.md：
- 生产 env 表（SESSION_SECRET / FAL_KEY / 禁止 ALLOW_DEV_UPGRADE）
- soft-live 验收 10 条
- 回滚：去掉 FAL_KEY 的行为
可选：docs/prd/CREATE_PREFLIGHT_COPY.md 固定英文短句给 Claude

不要改 app 代码。commit [gpt] + push。
```

### Grok

```text
协调合流；写 SEO_PRIORITY 10 词；不抢 Claude 主实现。
老板要上时带 LAUNCH。
```
