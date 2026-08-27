# Macos

## Build

```sh
node bin/build.js --target=electron-builder-mac
```

## Code signing and notarization

Release DMGs must be signed and notarized. The release workflow fails before building the macOS artifact when a signing secret is missing, and verifies the signature and notarization ticket before uploading the DMG. Builds from the trusted `main` CI workflow are also signed when all credentials are present. Pull-request builds intentionally remain unsigned.

### Apple setup

1. Enroll in the Apple Developer Program.
2. As the Account Holder, create a `Developer ID Application` certificate for direct distribution. A `Developer ID Installer` certificate is not needed for the DMG target.
3. Export the certificate and its private key as a password-protected `.p12`.
4. In App Store Connect, create a team API key with the `Developer` role and download the `.p8` file. Individual API keys cannot access Apple's notarization service.
5. Record the key ID, issuer ID, and Apple Developer team ID. The `.p8` file can only be downloaded once, so retain a secure backup.

### GitHub secrets

Encode the certificate and API key before adding them to the repository secrets:

```sh
base64 -i certificate.p12 -o certificate.p12.base64
base64 -i AuthKey_KEYID.p8 -o AuthKey_KEYID.p8.base64
```

Required secrets:

- `CSC_LINK`: base64-encoded `.p12`
- `CSC_KEY_PASSWORD`: `.p12` export password
- `APPLE_API_KEY_BASE64`: base64-encoded `.p8`
- `APPLE_API_KEY_ID`: App Store Connect key ID
- `APPLE_API_ISSUER`: App Store Connect issuer ID
- `APPLE_TEAM_ID`: Apple developer team ID

The workflows decode `APPLE_API_KEY_BASE64` into a temporary `.p8` file and pass that file path to electron-builder as `APPLE_API_KEY`. Keep these as repository secrets, never repository variables.

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
