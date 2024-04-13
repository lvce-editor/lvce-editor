import { expect, test } from '@jest/globals'
import * as ContentSecurityPolicySyntaxHighlightingWorker from '../src/parts/ContentSecurityPolicySyntaxHighlightingWorker/ContentSecurityPolicySyntaxHighlightingWorker.js'

test('contentSecurityPolicySyntaxHighlightingWorker - should have a strict default policy', () => {
  expect(ContentSecurityPolicySyntaxHighlightingWorker.value).toContain(`default-src 'none'`)
})

test('contentSecurityPolicySyntaxHighlightingWorker - should allow scripts', () => {
  expect(ContentSecurityPolicySyntaxHighlightingWorker.value).toContain(`script-src 'self'`)
})
