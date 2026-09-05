#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: ./verify-url.sh http://127.0.0.1:4173/" >&2
  exit 2
fi

node scripts/verify-url.mjs "$1"
