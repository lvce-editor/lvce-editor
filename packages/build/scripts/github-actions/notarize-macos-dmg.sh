#!/usr/bin/env bash

set -euo pipefail

readonly dmg_path="${1:-packages/build/.tmp/releases/lvce-arm64.dmg}"

: "${APPLE_API_KEY:?APPLE_API_KEY is required}"
: "${APPLE_API_KEY_ID:?APPLE_API_KEY_ID is required}"
: "${APPLE_API_ISSUER:?APPLE_API_ISSUER is required}"

if [[ ! -f "$dmg_path" ]]; then
  echo "macOS DMG not found: $dmg_path" >&2
  exit 1
fi
xcrun notarytool submit "$dmg_path" \
  --key "$APPLE_API_KEY" \
  --key-id "$APPLE_API_KEY_ID" \
  --issuer "$APPLE_API_ISSUER" \
  --wait
xcrun stapler staple "$dmg_path"
