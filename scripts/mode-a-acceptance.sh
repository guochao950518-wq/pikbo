#!/usr/bin/env bash
# Mode A private-preview acceptance (no public DNS, no Stripe live).
# Usage: BASE_URL=https://your.vercel.app bash scripts/mode-a-acceptance.sh
set -euo pipefail
export NO_PROXY="*" no_proxy="*"
unset ALL_PROXY all_proxy HTTP_PROXY HTTPS_PROXY http_proxy https_proxy 2>/dev/null || true

BASE="${BASE_URL:-${1:-http://127.0.0.1:3000}}"
BASE="${BASE%/}"

echo "== Pikbo Mode A acceptance @ ${BASE} =="
echo

# 1) Soft-live env presence (local only when env exported)
if [[ -n "${SESSION_SECRET:-}${CREDITS_SECRET:-}" || -n "${FAL_KEY:-}" ]]; then
  bash "$(dirname "$0")/softlive-checklist.sh" || true
  echo
fi

# 2) Critical path (pages + health honesty)
bash "$(dirname "$0")/critical-path.sh" "${BASE}"
echo

# 3) Link-check sample of public routes
if [[ -f "$(dirname "$0")/link-check.sh" ]]; then
  echo "== link-check =="
  bash "$(dirname "$0")/link-check.sh" "${BASE}" || {
    echo "WARN link-check failed — fix 404s before Mode B"
    exit 1
  }
  echo
fi

# 4) Health JSON gates for Mode A
curl --noproxy '*' -sS -m 15 "${BASE}/api/health" | tee /tmp/pikbo-mode-a-health.json >/dev/null
python3 - <<'PY'
import json, os, sys
h=json.load(open("/tmp/pikbo-mode-a-health.json"))
ready=h.get("ready") or {}
pay=h.get("payments") or {}
t6=h.get("t6") or {}
print("ready:", ready)
print("payments.clientEnabled:", pay.get("clientEnabled"), "secretMode:", pay.get("secretMode"))
print("t6:", t6.get("status"), t6.get("freeLiveRawDownload"))
if ready.get("demo") is not True:
    sys.exit("FAIL ready.demo must be true")
# Soft Mode A: payments must stay off for public-facing Coming soon honesty
if pay.get("clientEnabled") is True and os.environ.get("ALLOW_PAYMENTS_ON_MODE_A") != "1":
    print("WARN payments clientEnabled=true on Mode A — only OK on private test with boss approval")
if t6.get("status") == "ready" and t6.get("fileBake") is not True:
    sys.exit("FAIL t6 ready without fileBake is dishonest")
if t6.get("freeLiveRawDownload") == "allowed" and t6.get("status") != "ready":
    sys.exit("FAIL free live download allowed while T6 not ready")
# Production topup must be off
if h.get("devTopup") is True and os.environ.get("NODE_ENV") == "production":
    sys.exit("FAIL devTopup true in production")
# Ops probes must exist (presence only — never secrets)
assets=h.get("assets") or {}
if "count" not in assets and assets.get("mode") is None:
    print("WARN health.assets probe missing — preferred for Mode A ops")
else:
    print(f"assets count={assets.get('count')} mode={assets.get('mode')}")
jobs=h.get("jobs") or {}
if jobs:
    print(f"jobs count={jobs.get('count')} mode={jobs.get('mode')}")
rl=h.get("rateLimit") or {}
if isinstance(rl, dict):
    print(f"rateLimit inflight={rl.get('inflight')} ttlMs={rl.get('inflightTtlMs')}")
vw=h.get("videoWebhook") or {}
if vw:
    print(f"videoWebhook secretConfigured={vw.get('secretConfigured')}")
    # On production Mode A hosts, secret should be set before enabling async provider
    if os.environ.get("VERCEL_ENV") == "production" and not vw.get("secretConfigured"):
        print("WARN VIDEO_PROVIDER_WEBHOOK_SECRET missing on production host — unsigned webhooks refused")
print("mode-a health honesty: PASS")
PY

echo
echo "mode-a-acceptance: PASS"
echo "Next: record BASE URL + health JSON in HANDOFF; do NOT bind pikbo.ai DNS yet."
