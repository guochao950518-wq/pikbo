# 用 Telegram 指挥三个 AI

## 你要的体验

手机发一句 → 写入 `docs/DISPATCH.md` → 复制同一句口令给三个 AI → 他们 pull 后各干各的。

## 5 分钟开通

### 1. 找 BotFather 建机器人
1. Telegram 搜索 **@BotFather**
2. 发 `/newbot`
3. 起名，例如 `Pikbo Boss Bot`
4. 复制 **Token**（一长串数字:字母）

### 2. 本机启动

```bash
cd ~/claude/pikbo
export TELEGRAM_BOT_TOKEN='粘贴BotFather给的token'
export PIKBO_REPO="$HOME/claude/pikbo"
python3 tools/telegram_dispatch_bot.py
```

### 3. 拿 chat_id（建议锁死只听你的）
1. 手机找到你的机器人，发：`你好`
2. 电脑终端会打印 `chat_id=xxxxxxxx`
3. Ctrl+C 停掉，再启动：

```bash
export TELEGRAM_BOT_TOKEN='...'
export TELEGRAM_CHAT_ID='你的chat_id'
export PIKBO_REPO="$HOME/claude/pikbo"
python3 tools/telegram_dispatch_bot.py
```

### 4. 派活
手机发：

```
派活：本周 pikbo.ai 上线，Grok 管部署，GPT 管首页，Claude 管 SEO
```

机器人会回复 **开工口令**。把口令贴到三个 AI 窗口即可。

### 5. （可选）自动 push 到 GitHub
机器人默认只写本地文件。写完后在电脑执行：

```bash
cd ~/claude/pikbo
git add docs/DISPATCH.md
git commit -m "[boss] dispatch update"
git push
```

或让 Grok 帮你 commit push。

## 和 Hermes 的关系
你机器上的 Hermes 也曾接 Telegram，但 Token 失效。  
这个小脚本更简单，专为 Pikbo 派活；以后再合并进 Hermes 也可以。
