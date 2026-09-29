#!/usr/bin/env bash

set -euo pipefail

readonly mode="${1:-required}"
readonly signing_secrets=(
  APPLE_API_KEY_BASE64
  APPLE_API_KEY_ID
  APPLE_API_ISSUER
  APPLE_TEAM_ID
  CSC_LINK
  CSC_KEY_PASSWORD
)

if [[ "$mode" != "required" && "$mode" != "optional" ]]; then
  echo "Usage: $0 [required|optional]" >&2
  exit 2
fi

for secret in "${signing_secrets[@]}"; do
  if [[ -z "${!secret:-}" ]]; then
    if [[ "$mode" == "optional" ]]; then
      echo "macOS signing is disabled because one or more signing secrets are unavailable."
      echo "enabled=false" >> "${GITHUB_OUTPUT:?GITHUB_OUTPUT is required}"
      exit 0
    fi
    echo "Missing required macOS signing secret: $secret" >&2
    exit 1
  fi
done

readonly api_key_path="${RUNNER_TEMP:?RUNNER_TEMP is required}/AuthKey_${APPLE_API_KEY_ID}.p8"
readonly certificate_path="$RUNNER_TEMP/developer-id-application.p12"
readonly keychain_path="$RUNNER_TEMP/lvce-signing.keychain-db"
readonly keychain_password="$(uuidgen)"

printf '%s' "$APPLE_API_KEY_BASE64" | base64 -D > "$api_key_path"
printf '%s' "$CSC_LINK" | base64 -D > "$certificate_path"
test -s "$api_key_path"
test -s "$certificate_path"
chmod 600 "$api_key_path"

security create-keychain -p "$keychain_password" "$keychain_path"
security set-keychain-settings -lut 21600 "$keychain_path"
security unlock-keychain -p "$keychain_password" "$keychain_path"
security list-keychains -d user -s "$keychain_path"
security import "$certificate_path" -k "$keychain_path" -P "$CSC_KEY_PASSWORD" -T /usr/bin/codesign
security set-key-partition-list -S apple-tool:,apple:,codesign: -s -k "$keychain_password" "$keychain_path"
security find-identity -v -p codesigning "$keychain_path" | grep 'Developer ID Application'

rm "$certificate_path"
{
  echo "APPLE_API_KEY_PATH=$api_key_path"
  echo "CSC_KEYCHAIN_PATH=$keychain_path"
} >> "${GITHUB_ENV:?GITHUB_ENV is required}"

if [[ "$mode" == "optional" ]]; then
  echo "enabled=true" >> "${GITHUB_OUTPUT:?GITHUB_OUTPUT is required}"
fi
