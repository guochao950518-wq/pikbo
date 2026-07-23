# DISPATCH — 新分工生效（老板定）

**生效：** 立刻  
**权威角色表：** `docs/ROLES.md`  
**协作规则：** `COLLAB.md`  
**原则：** 第一性原理（图→片、诚实成本、公网可及）+ 交叉先沟通  

---

## 当前角色

| Agent | 职责 |
|-------|------|
| **Claude** | **全部代码与工程实现**（前后端、架构、重构、质量） |
| **GPT** | **产品规划与结构化**（PRD、数据、业务、API 设计、商业规则） |
| **Grok** | **创意 / 差异化 / 增长** + 协调合流优先级 + 老板同步 |

---

## 现在立刻干

### GPT（先出结构，Claude 才能写）

| ID | 交付 | 路径建议 | 状态 |
|----|------|----------|------|
| P1 | **Soft-launch PRD**（免费试玩 + Create 主路径 + 诚实限制） | `docs/prd/SOFT_LAUNCH.md` | **todo** |
| P2 | **订阅与积分商业规则**（1/5/15、何时可真收费、失败退款） | `docs/business/CREDITS_AND_PLANS.md` | todo |
| P3 | **Generate API 规格**（与现 `lib/contracts.ts` 对齐或升级草案） | `docs/api/GENERATE.md` | todo |
| P4 | **T5 账号/持久积分数据模型**（表结构 + 状态机） | `docs/prd/AUTH_CREDITS.md` | todo |

**禁止：** 大改 `app/**` 业务代码；规格未定时不要让 Claude 猜商业规则。

### Claude（有规格就实现；无规格先修/稳）

| ID | 交付 | 状态 |
|----|------|------|
| E1 | 读 `docs/ROLES.md` + pull main；认领工程任务 | **todo** |
| E2 | 在 P1 落地前：修 build/tsc、已知 bug、可维护性重构 | todo |
| E3 | P1 就绪后：实现 soft-launch 缺口（按 PRD） | blocked on P1 |
| E4 | 设计/UI 实现并入工程职责（不再只交「审美旁路」） | ongoing |

**禁止：** 自定定价/无限量；大功能无 PRD 就开干。

### Grok（创意 + 协调）

| ID | 交付 | 状态 |
|----|------|------|
| G1 | 潮玩差异化 / 增长一页纸（本轮） | **doing** |
| G2 | 合流优先级：只合 Claude 工程 PR + GPT 文档 PR | ongoing |
| G3 | 不抢写业务代码；prompt/玩法建议写入 `docs/growth/` | ongoing |

---

## 交叉请求（模板）

```md
### Cross request · YYYY-MM-DD
- From: Grok | GPT | Claude
- To: …
- Need: …
- Block: …
```

---

## 复制给 GPT 的开工口令

```text
【老板新分工 · 严格遵守 docs/ROLES.md】
你是 GPT：只做产品规划与结构化，不主力写业务代码。

git fetch && git checkout main && git pull
git checkout -B agent/gpt/prd-soft-launch

立刻交付：
1) docs/prd/SOFT_LAUNCH.md — soft 上线范围、主路径、非目标、验收清单
2) docs/business/CREDITS_AND_PLANS.md — 与 lib/pricing.ts 一致的商业规则 + 何时可开 Stripe
3) docs/api/GENERATE.md — 请求/响应/错误码（对齐现 contracts，可标升级项）

commit 前缀 [gpt]，push，更新 docs/STATUS.md。
交叉需求先写 DISPATCH。不要大改 app/api 实现。
```

---

## 复制给 Claude 的开工口令

```text
【老板新分工 · 严格遵守 docs/ROLES.md】
你是 Claude：主力全部代码编写与工程实现。

git fetch && git checkout main && git pull
工作目录优先：/Users/x/claude/pikbo（main 或 agent/claude/*）

立刻：
1) 读 docs/ROLES.md + docs/DISPATCH.md
2) 在 GPT 的 PRD 未齐前：typecheck/lint 绿、修明显 bug、整理可维护性（小步 [claude] commit）
3) GPT push PRD 后：按 docs/prd/* 实现，不要自己发明商业规则

禁止：无规格改积分/订阅语义；抢 GPT 写 PRD。
有交叉：先在 DISPATCH 留言再动手。
```

---

## 仓库

https://github.com/guochao950518-wq/pikbo · 分支 `main`
