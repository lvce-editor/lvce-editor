import { expect, test } from '@jest/globals'
import * as ContentSecurityPolicySyntaxHighlightingWorker from '../src/parts/ContentSecurityPolicySyntaxHighlightingWorker/ContentSecurityPolicySyntaxHighlightingWorker.js'

test('contentSecurityPolicyFileSearchWorker - should have a strict default policy', () => {
  expect(ContentSecurityPolicySyntaxHighlightingWorker.value).toContain(`default-src 'none'`)
})

test('contentSecurityPolicyFileSearchWorker - should have a sandbox', () => {
  expect(ContentSecurityPolicySyntaxHighlightingWorker.value).toContain(`sandbox allow-same-origin`)
})
