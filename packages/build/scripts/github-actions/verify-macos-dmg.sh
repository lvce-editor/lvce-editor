#!/usr/bin/env bash

set -euo pipefail

readonly dmg_path="${1:-packages/build/.tmp/releases/lvce-arm64.dmg}"

if [[ ! -f "$dmg_path" ]]; then
  echo "macOS DMG not found: $dmg_path" >&2
  exit 1
fi
mount_point="$(mktemp -d "${RUNNER_TEMP:?RUNNER_TEMP is required}/lvce-dmg.XXXXXX")"
readonly mount_point

cleanup() {
  hdiutil detach "$mount_point" >/dev/null 2>&1 || true
  rmdir "$mount_point" >/dev/null 2>&1 || true
}

trap cleanup EXIT

hdiutil attach "$dmg_path" -nobrowse -readonly -mountpoint "$mount_point"
app_path="$(find "$mount_point" -maxdepth 2 -name '*.app' -print -quit)"
readonly app_path
test -n "$app_path"
codesign --verify --deep --strict --verbose=2 "$app_path"
spctl --assess --type execute --verbose "$app_path"
xcrun stapler validate "$dmg_path"
