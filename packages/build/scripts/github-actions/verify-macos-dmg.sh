#!/usr/bin/env bash

set -euo pipefail

readonly dmg_path="${1:-packages/build/.tmp/releases/lvce-arm64.dmg}"
readonly application_name="${2:-lvce}"

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

expected_version="$(/usr/libexec/PlistBuddy -c 'Print :CFBundleShortVersionString' "$app_path/Contents/Info.plist")"
cli_path="$app_path/Contents/Resources/app/bin/$application_name"
if [[ ! -x "$cli_path" ]]; then
  echo "macOS CLI not found or not executable: $cli_path" >&2
  exit 1
fi
test "$("$cli_path" -v)" = "$expected_version"
test "$("$cli_path" --version)" = "$expected_version"

signed_resources="$(find "$app_path" -type f -exec sh -c '
  for resource_path do
    if xattr -p com.apple.cs.CodeSignature "$resource_path" >/dev/null 2>&1; then
      printf "%s\n" "$resource_path"
    fi
  done
' sh {} +)"
readonly signed_resources
if [[ -n "$signed_resources" ]]; then
  echo "The app contains detached signatures on ordinary resource files:" >&2
  echo "$signed_resources" >&2
  exit 1
fi

codesign --verify --deep --strict --verbose=2 "$app_path"
spctl --assess --type execute --verbose "$app_path"
xcrun stapler validate "$dmg_path"
