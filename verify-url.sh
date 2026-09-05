#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 || $# -gt 2 ]]; then
  echo "Usage: ./verify-url.sh http://127.0.0.1:4173/ [expected-status]" >&2
  exit 2
fi

node scripts/verify-url.mjs "$1" "${2:-200}"
