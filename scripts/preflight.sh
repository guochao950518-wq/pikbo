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
  public/demos/moon-smoke.mp4 \
  public/demos/scout-story-mode.mp4 \
  public/demos/beatbot-unboxed.mp4
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

# One-click sample stills for Studio / Batch
missing_still=0
for f in \
  public/demos/orbit-still.webp \
  public/demos/moon-float.webp \
  public/demos/scout-still.webp \
  public/demos/beatbot-still.webp
do
  if [[ ! -f "$f" ]]; then
    echo "FAIL: missing sample still $f"
    missing_still=1
  fi
done
if [[ "$missing_still" -ne 0 ]]; then
  exit 1
fi
echo "OK: sample stills present"

node scripts/engine-smoke.mjs
echo "OK: engine-smoke"

npm run lint
npm run typecheck
npm run build
echo "OK: build green"
