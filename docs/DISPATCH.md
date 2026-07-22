# DISPATCH — parallel tracks

**Last human intent:** Claude 修审美 UI；Grok 继续地基/出片/运维，互不踩文件。

**协调：** Grok  

---

## Tracks

| Track | Owner | Branch | Scope | Freeze |
|-------|-------|--------|-------|--------|
| **UI aesthetic** | Claude | `agent/claude/ui-quality` | 字体、质感、film grain、交互细节、视觉 polish | 不改 generate 契约 / 积分 / session |
| **Foundation ops** | Grok | `agent/grok/foundation-ops` → main | demo 片源、rate limit、dev topup、health、preflight、LAUNCH | 不改 AppShell/首页视觉大改 |

合流：Claude UI 稳后 Grok 把 `ui-quality` merge 进 main；Grok ops 可先合 main。

---

## Grok now

| ID | Task | Status |
|----|------|--------|
| G1 | Lab demos ×12 + generate demo map by preset | done |
| G2 | Generate rate limit 8/min + free exhausted copy | done |
| G3 | `POST /api/dev/topup` (dev only) | done |
| G4 | preflight checks demo files | done |
| T7 | Boss Vercel + domain | blocked |

---

## Claude now

| ID | Task | Status |
|----|------|--------|
| UI1 | UI quality r1–r3 (font / grain / craft) | doing on ui-quality |

---

## Boss (when ready)

1. 美区礼品卡 → Claude Pro（设计继续）  
2. `docs/LAUNCH.md` 公网部署  

---

## 开工口令

**Claude**
```text
git pull。只做 UI 审美，不改 app/api 与 lib/session|pricing|contracts|generate。
```

**Grok**
```text
git pull。只做地基与出片水管，避开 components 大视觉重写。
```
