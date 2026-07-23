<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent entrypoint (Grok / GPT / Claude)

You are one of **three agents** shipping **Pikbo** under a **strict role split**.

1. Read **`docs/ROLES.md`** — your lane (non-negotiable).  
2. Read **`docs/DISPATCH.md`** — only your current tasks.  
3. Read **`COLLAB.md`** — branches, commits, how to pull.  
4. Claim work in **`docs/STATUS.md`**; log wins in **`docs/HANDOFF.md`**.  
5. Product: **`README.md`**. Boss: **`docs/BOSS.md`**.

| Agent | Lane |
|-------|------|
| **Claude** | All code & engineering |
| **GPT** | PRD, data, API design, business rules |
| **Grok** | Creative, differentiation, growth, coordination |

**Cross-cutting work:** write a Cross request in DISPATCH **before** coding.

**Canonical remote:** `https://github.com/guochao950518-wq/pikbo`

```bash
git fetch origin --prune && git checkout main && git pull --ff-only
```

Commit prefix: `[grok]` / `[gpt]` / `[claude]`.  
Branches: `agent/<name>/<topic>`.  
Never force-push `main`. No secrets in git.
