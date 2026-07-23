#!/usr/bin/env bash
# Critical-path smoke (FIRST_PRINCIPLES step 4) — no generate cost.
set -euo pipefail
# Local Next must not go through Clash/socks ALL_PROXY
export NO_PROXY="*"
export no_proxy="*"
unset ALL_PROXY all_proxy HTTP_PROXY HTTPS_PROXY http_proxy https_proxy 2>/dev/null || true
BASE="${1:-http://127.0.0.1:3000}"

need() {
  local path="$1"
  local code
  code=$(curl --noproxy '*' -sS -o /tmp/pikbo-cp-body -w "%{http_code}" -m 20 "${BASE}${path}" || echo "000")
  if [[ "$code" != "200" ]]; then
    echo "FAIL ${path} → HTTP ${code}"
    head -c 200 /tmp/pikbo-cp-body 2>/dev/null || true
    echo
    exit 1
  fi
  echo "OK   ${path} → ${code}"
}

echo "Pikbo critical path @ ${BASE}"
need "/"
need "/create"
need "/effects"
need "/library"
need "/pricing"
need "/community"
need "/explore"
need "/projects/orbit-cgi"
need "/create?mode=seller-pack"
need "/for/etsy-listing-videos"
need "/api/health"
need "/api/me"

curl --noproxy '*' -sS -m 10 "${BASE}/api/health" | tee /tmp/pikbo-health.json
echo
curl --noproxy '*' -sS -m 10 "${BASE}/api/me" | tee /tmp/pikbo-me.json
echo

if command -v python3 >/dev/null 2>&1; then
  python3 - <<'PY'
import json, os
h=json.load(open("/tmp/pikbo-health.json"))
mode=h.get("mode","?")
fal=h.get("fal")
ready=h.get("ready") or {}
print(f"health mode={mode} fal={fal} foundation={h.get('foundation')} ready={ready}")
# Phase B: default critical-path accepts *demo-cached* readiness without secrets.
# Soft-live strict mode only when REQUIRE_SOFT_LIVE=1.
require_soft = os.environ.get("REQUIRE_SOFT_LIVE") == "1"
if ready.get("demo") is not True:
    raise SystemExit("health.ready.demo missing — demo path must always be ready")
if require_soft:
    if not h.get("ok") or h.get("degraded"):
        raise SystemExit("health degraded (REQUIRE_SOFT_LIVE=1)")
    if ready.get("softLive") is not True:
        raise SystemExit("health.ready.softLive false under REQUIRE_SOFT_LIVE=1")
    print("soft-live gate PASS")
else:
    if not h.get("ok") and h.get("degraded") and ready.get("demo") is True:
        print("WARN health degraded but ready.demo=true — accepting demo-cached critical path")
    elif not h.get("ok") and not ready.get("demo"):
        raise SystemExit("health not ok and demo not ready")
    print("demo-cached gate PASS")
me=json.load(open("/tmp/pikbo-me.json"))
assert "credits" in me and "plan" in me
assert me.get("mode") in ("live-generate", "demo-cached")
assert me.get("cachedDemoFree") is True
print(f"me plan={me.get('plan')} mode={me.get('mode')} credits={me.get('credits')}")
PY
fi

echo "critical-path: PASS"
