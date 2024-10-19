import { expect, test } from '@jest/globals'
import * as ContentSecurityPolicyTestWorker from '../src/parts/ContentSecurityPolicyTestWorker/ContentSecurityPolicyTestWorker.js'

test('contentSecurityPolicyTestWorker - should have a strict default policy', () => {
  expect(ContentSecurityPolicyTestWorker.value).toContain(`default-src 'none'`)
})

test('contentSecurityPolicyTestWorker - should allow scripts', () => {
  expect(ContentSecurityPolicyTestWorker.value).toContain(`script-src 'self'`)
})

test('contentSecurityPolicyTestWorker - should have a sandbox', () => {
  expect(ContentSecurityPolicyTestWorker.value).toContain(`sandbox allow-same-origin`)
})
