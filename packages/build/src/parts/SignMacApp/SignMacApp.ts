import { signAsync } from '@electron/osx-sign'

export const getSigningKeychain = (environment: Readonly<Record<string, string | undefined>>) => {
  return environment.CSC_KEYCHAIN || undefined
}

export const signMacApp = async ({ appPath, entitlementsPath, entitlementsInheritPath, environment = process.env }) => {
  const keychain = getSigningKeychain(environment)
  if (!keychain) {
    return false
  }
  await signAsync({
    app: appPath,
    keychain,
    platform: 'darwin',
    strictVerify: true,
    optionsForFile(filePath) {
      return {
        entitlements: filePath === appPath ? entitlementsPath : entitlementsInheritPath,
        hardenedRuntime: true,
      }
    },
  })
  return true
}
