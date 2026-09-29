import { expect, test } from '@jest/globals'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { getSigningKeychain, isMachOHeader, shouldIgnoreMacCodeSignPath } from '../src/parts/SignMacApp/SignMacApp.ts'

test('macOS signing remains disabled without a signing keychain', () => {
  expect(getSigningKeychain({})).toBeUndefined()
})

test('macOS signing uses the configured keychain', () => {
  expect(getSigningKeychain({ CSC_KEYCHAIN: '/tmp/signing.keychain-db' })).toBe('/tmp/signing.keychain-db')
})

test.each([
  [0xfe, 0xed, 0xfa, 0xce],
  [0xce, 0xfa, 0xed, 0xfe],
  [0xfe, 0xed, 0xfa, 0xcf],
  [0xcf, 0xfa, 0xed, 0xfe],
  [0xca, 0xfe, 0xba, 0xbe],
  [0xbe, 0xba, 0xfe, 0xca],
  [0xca, 0xfe, 0xba, 0xbf],
  [0xbf, 0xba, 0xfe, 0xca],
])('recognizes Mach-O header %p', (...header) => {
  expect(isMachOHeader(Uint8Array.from(header))).toBe(true)
})

test('does not recognize non-Mach-O resources as code', () => {
  expect(isMachOHeader(Uint8Array.from([0x89, 0x50, 0x4e, 0x47]))).toBe(false)
  expect(isMachOHeader(Uint8Array.from([0x7f, 0x45, 0x4c, 0x46]))).toBe(false)
  expect(isMachOHeader(Uint8Array.from([0x50, 0x4b, 0x03, 0x04]))).toBe(false)
})

test('signs Mach-O files but ignores binary resource files', () => {
  const fixturePath = mkdtempSync(join(tmpdir(), 'lvce-macos-signing-'))
  try {
    const machOPath = join(fixturePath, 'native.node')
    const resourcePath = join(fixturePath, 'resource.pak')
    writeFileSync(machOPath, Uint8Array.from([0xcf, 0xfa, 0xed, 0xfe]))
    writeFileSync(resourcePath, Uint8Array.from([0x50, 0x4b, 0x03, 0x04]))

    expect(shouldIgnoreMacCodeSignPath(machOPath)).toBe(false)
    expect(shouldIgnoreMacCodeSignPath(resourcePath)).toBe(true)
    expect(shouldIgnoreMacCodeSignPath(join(fixturePath, 'Nested.app'))).toBe(false)
  } finally {
    rmSync(fixturePath, { recursive: true })
  }
})
