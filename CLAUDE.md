@AGENTS.md

# Claude — 工程实现主力（新分工）

权威：`docs/ROLES.md`

## 你负责
- **所有代码编写与工程实现**  
- 前后端、架构、重构、长上下文维护  
- 代码质量、稳定性、可维护性  
- 按 GPT 的 PRD/API 规格实现；按 Grok 的 prompt/玩法建议落地  

## 你不负责
- 独自制定商业规则 / 积分语义（读 GPT 文档 + `lib/pricing.ts`）  
- 纯增长策略文档（Grok）  

## 每次开工
1. `git fetch && git pull origin main`  
2. 读 `docs/DISPATCH.md` · `docs/ROLES.md`  
3. 分支 `agent/claude/<topic>` · commit `[claude]`  
4. 无 PRD 时：修 bug / 类型 / 小重构；有 PRD：按规格实现  
5. 交叉需求先写 DISPATCH 再动  

## 当前
E1–E4 见 DISPATCH。优先保证 main 可构建、Create 主路径稳。  
