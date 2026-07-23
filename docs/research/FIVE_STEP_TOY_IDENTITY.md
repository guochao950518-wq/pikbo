# 五步工作法 · 本轮只做 Toy Identity + 交付闭环

**日期：** 2026-07-24  
**依据：** `docs/FIRST_PRINCIPLES.md` · 老板授权「你说怎么做就怎么做」  
**调研站用途：** 仅作需求对照，**禁止类比堆功能**。

---

## Step 1 — 让需求不蠢

| 调研站诱惑 | 蠢需求 | 不蠢的需求 |
|------------|--------|------------|
| OpenArt Character / HF Soul | 建角色训练系统 | 可选 **SKU 名 + 保留点** 写入 extra |
| 妙呀 文→三视图→IP 包 | 做从零造 IP | **已有静图** 出片后 **发帖清单** |
| Meshy 3D | 接 3D API | 不做 |
| 多模型墙 | 假 Kling 切换 | 禁止 |
| Krea 实时画布 | 新 canvas 产品 | **同图换 job 一键再生成** |

**本轮唯一物理目标：**  
同一只玩具的图 → 更稳地连出多条可发片 → 用户知道下一步发哪里。

## Step 2 — 删除

- 不新增主导航  
- 不上 Character 云档案 / LoRA  
- 不上 3D / Cinema / 假多模型  
- 不用第三根全宽「调研对标」栏；Identity 贴在照片步骤旁  

## Step 3 — 简化

- Identity = **2 个字段** + localStorage  
- 合成进已有 `extra` → 已有 `buildGeneratePrompt` + `TOY_IDENTITY_LOCK`  
- 交付 = **结果区 checklist**，不是新 App  
- 换 job = 复用 `JOB_INTENTS`，不新 registry  

## Step 4 — 加速

- 出片后「Same photo · next job」直接 `effectOverride` + generate  
- 无新路由往返（Seller Pack 除外）  

## Step 5 — 自动化（本轮不做）

- 不做自动识图起 SKU 名  
- 不做自动发帖 / 自动训练  

---

## 验收

- [ ] Create 照片下有可选 Toy name / Preserve  
- [ ] 生成请求 extra 含 identity（有填时）  
- [ ] 成功后有 delivery checklist  
- [ ] 成功后有 same-photo job 芯片可再跑  
- [ ] 无新假模型、无 3D、无新主导航  

*Grok · five-step · 2026-07-24*
