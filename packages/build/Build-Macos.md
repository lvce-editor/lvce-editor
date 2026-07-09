# Macos

## Build

```sh
node bin/build.js --target=electron-builder-mac
```

## Code signing and notarization

Release DMGs are signed and notarized by the GitHub Actions release workflow when the macOS signing secrets are present. PR and normal CI builds do not receive these secrets.

### Apple setup

1. Enroll in the Apple Developer Program.
2. Create a `Developer ID Application` certificate for direct distribution.
3. Export the certificate from Keychain Access as a password-protected `.p12`.
4. Create an App Store Connect API key and download the `.p8` file.

### GitHub secrets

Encode the certificate and API key before adding them to the repository secrets:

```sh
base64 -i certificate.p12 -o certificate.p12.base64
base64 -i AuthKey_KEYID.p8 -o AuthKey_KEYID.p8.base64
```

Required secrets:

- `MAC_CSC_LINK`: base64-encoded `.p12`
- `MAC_CSC_KEY_PASSWORD`: `.p12` export password
- `APPLE_API_KEY`: base64-encoded `.p8`
- `APPLE_API_KEY_ID`: App Store Connect key ID
- `APPLE_API_ISSUER`: App Store Connect issuer ID
- `APPLE_TEAM_ID`: Apple developer team ID

The workflows decode `APPLE_API_KEY` into a temporary `.p8` file and pass that file path to electron-builder as `APPLE_API_KEY`.

### Bundle identifiers

- `lvce`: `com.lvceeditor.lvce`
- `lvce-oss`: `com.lvceeditor.lvce-oss`

### Smoke test

Run the `macos-signing-smoke` workflow manually from GitHub Actions after adding or rotating secrets. It builds the signed DMG and verifies the app and DMG with:

```sh
codesign --verify --deep --strict --verbose=2 path/to/Lvce.app
spctl --assess --type execute --verbose path/to/Lvce.app
xcrun stapler validate path/to/Lvce.app
xcrun stapler validate path/to/lvce-arm64.dmg
```
