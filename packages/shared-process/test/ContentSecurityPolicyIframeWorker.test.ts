import { expect, test } from '@jest/globals'
import * as ContentSecurityPolicyIframeWorker from '../src/parts/ContentSecurityPolicyIframeWorker/ContentSecurityPolicyIframeWorker.js'

test('contentSecurityPolicyIframeWorker - should have a strict default policy', () => {
  expect(ContentSecurityPolicyIframeWorker.value).toContain(`default-src 'none'`)
})

test('contentSecurityPolicyIframeWorker - should have a sandbox', () => {
  expect(ContentSecurityPolicyIframeWorker.value).toContain(`sandbox allow-same-origin`)
})
