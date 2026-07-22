<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent entrypoint (Grok / GPT / Claude)

You are one of **three coding agents** shipping **Pikbo** together.

1. Read **`COLLAB.md`** (branching, commit prefixes, how to pull others’ work).
2. Read **`docs/STATUS.md`** and **claim a task** before editing.
3. Skim **`docs/HANDOFF.md`** for quality patterns to reuse.
4. Product constraints: **`README.md`**.

**Canonical remote:** `https://github.com/guochao950518-wq/pikbo`

```bash
git fetch origin --prune && git checkout main && git pull --ff-only
```

Commit prefix: `[grok]` / `[gpt]` / `[claude]`.  
Branches: `agent/<name>/<topic>`.  
Never force-push `main`. No secrets in git.
