#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
echo "== Pikbo preflight =="
echo "node $(node -v)"
if git grep -nE '^(<<<<<<<|>>>>>>>|=======)' -- app lib components 2>/dev/null; then
  echo "FAIL: conflict markers"
  exit 1
fi
echo "OK: no conflict markers"
npm run lint
npm run build
echo "OK: build green"
