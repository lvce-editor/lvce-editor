import { expect, test } from '@jest/globals'
import * as GetHeadersMainFrame from '../src/parts/GetHeadersMainFrame/GetHeadersMainFrame.js'

test('getHeadersMainFrame - cross origin opener policy', () => {
  const headers = GetHeadersMainFrame.getHeadersMainFrame()
  expect(headers['Cross-Origin-Opener-Policy']).toBe(`same-origin`)
})

test('getHeadersMainFrame - cross origin embedded policy', () => {
  const headers = GetHeadersMainFrame.getHeadersMainFrame()
  expect(headers['Cross-Origin-Embedder-Policy']).toBe(`require-corp`)
})

test('getHeadersMainFrame - content security policy', () => {
  const headers = GetHeadersMainFrame.getHeadersMainFrame()
  expect(headers['Content-Security-Policy']).toBeDefined()
})

test('getHeadersMainFrame - content security policy - strict default src', () => {
  const headers = GetHeadersMainFrame.getHeadersMainFrame()
  expect(headers['Content-Security-Policy']).toContain("default-src 'none'")
})
