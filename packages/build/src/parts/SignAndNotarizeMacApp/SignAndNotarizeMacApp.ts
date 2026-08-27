import { notarize } from '@electron/notarize'
import { signAsync } from '@electron/osx-sign'

const requiredEnvironmentVariables = ['APPLE_API_KEY', 'APPLE_API_KEY_ID', 'APPLE_API_ISSUER', 'CSC_KEYCHAIN'] as const

export const getSigningEnvironment = (environment: Readonly<Record<string, string | undefined>>) => {
  const isConfigured = requiredEnvironmentVariables.some((key) => environment[key])
  if (!isConfigured) {
    return undefined
  }
  for (const key of requiredEnvironmentVariables) {
    if (!environment[key]) {
      throw new Error(`Missing required macOS signing environment variable: ${key}`)
    }
  }
  return {
    appleApiIssuer: environment.APPLE_API_ISSUER!,
    appleApiKey: environment.APPLE_API_KEY!,
    appleApiKeyId: environment.APPLE_API_KEY_ID!,
    keychain: environment.CSC_KEYCHAIN!,
  }
}

export const signAndNotarizeMacApp = async ({ appPath, entitlementsPath, entitlementsInheritPath, environment = process.env }) => {
  const signingEnvironment = getSigningEnvironment(environment)
  if (!signingEnvironment) {
    return false
  }
  await signAsync({
    app: appPath,
    keychain: signingEnvironment.keychain,
    platform: 'darwin',
    strictVerify: true,
    optionsForFile(filePath) {
      return {
        entitlements: filePath === appPath ? entitlementsPath : entitlementsInheritPath,
        hardenedRuntime: true,
      }
    },
  })
  await notarize({
    appPath,
    appleApiIssuer: signingEnvironment.appleApiIssuer,
    appleApiKey: signingEnvironment.appleApiKey,
    appleApiKeyId: signingEnvironment.appleApiKeyId,
  })
  return true
}
