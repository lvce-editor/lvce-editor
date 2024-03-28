import { expect, test } from '@jest/globals'
import * as ContentSecurityPolicyDocument from '../src/parts/ContentSecurityPolicyDocument/ContentSecurityPolicyDocument.js'

test('contentSecurityPolicyDocument - should have a strict default policy', () => {
  expect(ContentSecurityPolicyDocument.value).toContain(`default-src 'none'`)
})

test('contentSecurityPolicyDocument - should allow media', () => {
  expect(ContentSecurityPolicyDocument.value).toContain(`media-src 'self'`)
})

test('contentSecurityPolicyDocument - should allow fonts', () => {
  expect(ContentSecurityPolicyDocument.value).toContain(`font-src 'self'`)
})

test('contentSecurityPolicyDocument - should allow only local scripts', () => {
  expect(ContentSecurityPolicyDocument.value).toContain(`script-src 'self'`)
})

test('contentSecurityPolicyDocument - should allow images (local, https and data)', () => {
  expect(ContentSecurityPolicyDocument.value).toContain(`img-src 'self' https: data:`)
})
