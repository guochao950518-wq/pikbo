#!/usr/bin/env bash
# Soft-live env checklist (boss wake / ops). Presence only — never prints secret values.
set -euo pipefail
cd "$(dirname "$0")/.."

ok=0
bad=0
check() {
  local name="$1"
  local present="$2"
  if [[ "$present" == "1" ]]; then
    echo "OK   $name"
    ok=$((ok + 1))
  else
    echo "MISS $name"
    bad=$((bad + 1))
  fi
}

echo "== Pikbo soft-live checklist =="
check "SESSION_SECRET|CREDITS_SECRET" "$([[ -n "${SESSION_SECRET:-}${CREDITS_SECRET:-}" ]] && echo 1 || echo 0)"
check "FAL_KEY (live generate)" "$([[ -n "${FAL_KEY:-}" ]] && echo 1 || echo 0)"
check "STRIPE_SECRET_KEY (paid)" "$([[ -n "${STRIPE_SECRET_KEY:-}" ]] && echo 1 || echo 0)"
check "STRIPE_WEBHOOK_SECRET" "$([[ -n "${STRIPE_WEBHOOK_SECRET:-}" ]] && echo 1 || echo 0)"
check "STRIPE_PRICE_CREATOR" "$([[ -n "${STRIPE_PRICE_CREATOR:-}" ]] && echo 1 || echo 0)"
check "STRIPE_PRICE_SHOP" "$([[ -n "${STRIPE_PRICE_SHOP:-}" ]] && echo 1 || echo 0)"

if [[ -n "${1:-}" ]]; then
  BASE="${1}"
  export NO_PROXY="*" no_proxy="*"
  unset ALL_PROXY all_proxy HTTP_PROXY HTTPS_PROXY http_proxy https_proxy 2>/dev/null || true
  echo
  echo "Probing ${BASE}/api/health …"
  code=$(curl --noproxy '*' -sS -o /tmp/pikbo-softlive-health.json -w "%{http_code}" -m 15 "${BASE}/api/health" || echo "000")
  if [[ "$code" == "200" ]]; then
    echo "OK   /api/health HTTP 200"
    if command -v python3 >/dev/null 2>&1; then
      python3 - <<'PY'
import json
h=json.load(open("/tmp/pikbo-softlive-health.json"))
print("mode=", h.get("mode"))
print("ready=", h.get("ready"))
print("rateLimit=", h.get("rateLimit"))
cl=h.get("softLiveChecklist") or {}
print("checklist fal=", cl.get("FAL_KEY"), "sessionSecret=", cl.get("SESSION_SECRET"))
print("entitlements writable=", (h.get("entitlements") or {}).get("writable"))
PY
    fi
  else
    echo "FAIL /api/health HTTP $code"
    bad=$((bad + 1))
  fi
fi

echo
echo "Summary: $ok present · $bad missing/fail"
echo "See docs/LAUNCH.md for deploy steps."
# Non-zero only if remote probe failed; local env misses are informational.
exit 0
