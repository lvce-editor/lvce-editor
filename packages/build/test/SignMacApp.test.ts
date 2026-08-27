import { expect, test } from '@jest/globals'
import { getSigningKeychain } from '../src/parts/SignMacApp/SignMacApp.ts'

test('macOS signing remains disabled without a signing keychain', () => {
  expect(getSigningKeychain({})).toBeUndefined()
})

test('macOS signing uses the configured keychain', () => {
  expect(getSigningKeychain({ CSC_KEYCHAIN: '/tmp/signing.keychain-db' })).toBe('/tmp/signing.keychain-db')
})
