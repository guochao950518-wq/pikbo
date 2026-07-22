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

# Lab demos must exist (soft-launch / demo-generate path)
missing=0
for f in \
  public/demos/orbit-hyper-cgi.mp4 \
  public/demos/moon-box-reveal.mp4 \
  public/demos/scout-packshot-spin.mp4 \
  public/demos/beatbot-viral-hook.mp4 \
  public/demos/orbit-dance.mp4 \
  public/demos/moon-glow.mp4 \
  public/demos/scout-walk.mp4 \
  public/demos/beatbot-neon.mp4 \
  public/demos/orbit-aura.mp4 \
  public/demos/moon-smoke.mp4
do
  if [[ ! -f "$f" ]]; then
    echo "FAIL: missing $f"
    missing=1
  fi
done
if [[ "$missing" -ne 0 ]]; then
  exit 1
fi
echo "OK: lab demos present"

npm run lint
npm run build
echo "OK: build green"
