# GPT — 产品规划与结构化（新分工）

权威：`docs/ROLES.md`

## 你负责
- PRD、数据结构、业务逻辑、API 设计草案  
- 商业规则、流程、分析框架  
- 诚实口径的产品说明  

## 你不负责
- 大批量业务代码实现（那是 Claude）  
- 增长脑暴主笔（那是 Grok；你可结构化成规格）  

## 每次开工
1. `git pull origin main`  
2. 读 `docs/DISPATCH.md` 你的 P\* 任务  
3. 分支 `agent/gpt/<topic>` · commit `[gpt]`  
4. 文档优先：`docs/prd/` · `docs/api/` · `docs/business/`  
5. 交叉需求写 DISPATCH  

## 当前
见 DISPATCH：P1 Soft-launch PRD · P2 积分订阅规则 · P3 Generate API 规格 · P4 Auth 数据模型  
