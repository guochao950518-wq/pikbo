#!/usr/bin/env bash
# PageSpeed Insights batch audit for Pikbo public URLs.
# Usage:
#   export PSI_API_KEY=your_key
#   ./scripts/audit-pagespeed.sh https://pikbo.ai
# Docs: docs/SITE_AUDIT_APIS.md
set -euo pipefail

KEY="${PSI_API_KEY:-}"
BASE="${1:-}"

if [[ -z "$KEY" ]]; then
  echo "Missing PSI_API_KEY. Get one: https://console.cloud.google.com/apis/credentials"
  echo "Enable: PageSpeed Insights API"
  echo "Web UI (no key): https://pagespeed.web.dev/"
  exit 1
fi

if [[ -z "$BASE" ]]; then
  echo "Usage: PSI_API_KEY=... $0 https://pikbo.ai"
  exit 1
fi

# strip trailing slash
BASE="${BASE%/}"
PATHS=("" "/create" "/pricing" "/effects")

for path in "${PATHS[@]}"; do
  url="${BASE}${path}"
  enc=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=''))" "$url")
  echo "=== $url (mobile) ==="
  resp=$(curl -sS "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${enc}&strategy=mobile&category=performance&category=seo&category=accessibility&category=best-practices&key=${KEY}" || true)
  if command -v jq >/dev/null 2>&1; then
    echo "$resp" | jq -r '
      if .error then "ERROR: \(.error.message)"
      else
        (.lighthouseResult.categories // {})
        | to_entries[]
        | "\(.key): \((.value.score // 0) * 100 | floor)"
      end'
    echo "$resp" | jq -r '
      .lighthouseResult.audits // {}
      | {
          LCP: .["largest-contentful-paint"].displayValue,
          FCP: .["first-contentful-paint"].displayValue,
          CLS: .["cumulative-layout-shift"].displayValue,
          TBT: .["total-blocking-time"].displayValue
        }
      | to_entries[]
      | select(.value != null)
      | "  \(.key): \(.value)"' 2>/dev/null || true
  else
    echo "$resp" | head -c 400
    echo
  fi
  echo
done

echo "Done. Full expert API list: docs/SITE_AUDIT_APIS.md"
