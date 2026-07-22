# 薅羊毛：免费 / 低成本出片怎么接

**结论先说：**  
世界上**没有**稳定、无限、商用级的「永久免费图生视频 API」。  
能薅的是：**注册送额度 + 用最便宜的模型（Seedance Mini）**。

---

## 1. 推荐路径（给 Pikbo 用）

### Step A — 注册 fal 白嫖启动额度

1. 打开 https://fal.ai → Sign up  
2. Dashboard → **Keys** → 复制 API Key  
3. 写入本机（**不要提交 git**）：

```bash
# /Users/x/claude/pikbo/.env.local
SESSION_SECRET=（已有可不动）
FAL_KEY=你的密钥
# 免费层默认已是 Mini，可显式写：
FAL_MODEL_FREE=bytedance/seedance-2.0/mini/image-to-video
```

4. 重启 `npm run dev`  
5. 打开 http://127.0.0.1:3000/api/health → 应见 `"fal": true`  
6. `/create` 上传手办图试一条  

### Step B — 用最便宜模型

| 模型 | 端点 | 约价（文档） | 用途 |
|------|------|--------------|------|
| **Seedance Mini** | `bytedance/seedance-2.0/mini/image-to-video` | **~$0.072/s @480p** | **免费试玩 / 薅额度** |
| Seedance Fast | `.../fast/image-to-video` | ~$0.11/s @480p | 稍好一点 |
| Seedance 2.0 | `.../image-to-video` | ~$0.30/s @720p | 付费质量 |

代码默认：**Free 用户走 Mini**（`lib/models.ts`）。

一条 **5 秒 480p Mini** ≈ **$0.36** 量级（以 fal 账单为准）。  
注册送的额度能跑 **若干条**，够验流程，不够当生产无限池。

---

## 2. 其它「免费」选项（现实）

| 来源 | 能不能当 Pikbo 水管 | 评价 |
|------|---------------------|------|
| **fal 注册送额度** | ✅ 推荐 | 和现有 SDK 一致 |
| **Hugging Face free** | ⚠️ 每月约 **$0.10** | 只够玩 API，不够视频 |
| **完全免费无限 API** | ❌ | 基本没有可靠商用 |
| **本地开源 GPU** | ⚠️ | 要机器，不是 5 分钟 |

---

## 3. 诚实产品规则

- 无 `FAL_KEY` → **demo-cached**（本地潮玩片），仍可验 UI  
- 有 key + Mini → **真动效，最便宜**  
- 不要对外写「永久免费无限生成」  

---

## 4. 你现在只要做

1. 去 fal 注册拿 key  
2. 贴进 `.env.local`  
3. 告诉 Grok「key 配好了」→ 一起验收  

文档价格来源：fal Seedance Mini 模型页（~$0.0721/s @480p）。
