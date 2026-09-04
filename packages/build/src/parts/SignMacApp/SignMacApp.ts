import { sign } from '@electron/osx-sign'
import { closeSync, openSync, readSync } from 'node:fs'

const MachOMagic = new Set([
  'cafebabe',
  'cafebabf',
  'cefaedfe',
  'cffaedfe',
  'feedface',
  'feedfacf',
  'bebafeca',
  'bfbafeca',
])

export const isMachOHeader = (header: Uint8Array) => {
  if (header.length < 4) {
    return false
  }
  return MachOMagic.has(Buffer.from(header.subarray(0, 4)).toString('hex'))
}

const isMachOFile = (filePath: string) => {
  const fileDescriptor = openSync(filePath, 'r')
  try {
    const header = Buffer.alloc(4)
    return readSync(fileDescriptor, header, 0, header.length, 0) === header.length && isMachOHeader(header)
  } finally {
    closeSync(fileDescriptor)
  }
}

export const shouldIgnoreMacCodeSignPath = (filePath: string) => {
  if (filePath.endsWith('.app') || filePath.endsWith('.framework')) {
    return false
  }
  return !isMachOFile(filePath)
}

export const getSigningKeychain = (environment: Readonly<Record<string, string | undefined>>) => {
  return environment.CSC_KEYCHAIN || undefined
}

export const signMacApp = async ({ appPath, entitlementsPath, entitlementsInheritPath, environment = process.env }) => {
  const keychain = getSigningKeychain(environment)
  if (!keychain) {
    return false
  }
  await sign({
    app: appPath,
    ignore: shouldIgnoreMacCodeSignPath,
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
