import { expect, test } from '@jest/globals'
import { getSigningEnvironment } from '../src/parts/SignAndNotarizeMacApp/SignAndNotarizeMacApp.ts'

test('macOS signing remains disabled without signing environment variables', () => {
  expect(getSigningEnvironment({})).toBeUndefined()
})

test('macOS signing environment requires complete credentials', () => {
  expect(() => getSigningEnvironment({ APPLE_API_KEY: '/tmp/AuthKey.p8' })).toThrow(
    'Missing required macOS signing environment variable: APPLE_API_KEY_ID',
  )
})

test('macOS signing environment returns complete credentials', () => {
  expect(
    getSigningEnvironment({
      APPLE_API_ISSUER: 'issuer',
      APPLE_API_KEY: '/tmp/AuthKey.p8',
      APPLE_API_KEY_ID: 'key-id',
      CSC_KEYCHAIN: '/tmp/signing.keychain-db',
    }),
  ).toEqual({
    appleApiIssuer: 'issuer',
    appleApiKey: '/tmp/AuthKey.p8',
    appleApiKeyId: 'key-id',
    keychain: '/tmp/signing.keychain-db',
  })
})
