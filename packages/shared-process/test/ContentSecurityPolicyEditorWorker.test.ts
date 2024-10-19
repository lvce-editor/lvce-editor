import { expect, test } from '@jest/globals'
import * as ContentSecurityPolicyEditorWorker from '../src/parts/ContentSecurityPolicyEditorWorker/ContentSecurityPolicyEditorWorker.js'

test('contentSecurityPolicyEditorWorker - should have a strict default policy', () => {
  expect(ContentSecurityPolicyEditorWorker.value).toContain(`default-src 'none'`)
})

test('contentSecurityPolicyEditorWorker - should allow fonts', () => {
  expect(ContentSecurityPolicyEditorWorker.value).toContain(`font-src 'self'`)
})

test('contentSecurityPolicyEditorWorker - should have a sandbox', () => {
  expect(ContentSecurityPolicyEditorWorker.value).toContain(`sandbox allow-scripts allow-same-origin`)
})
