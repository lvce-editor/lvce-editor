import { afterEach, expect, jest, test } from '@jest/globals'
import * as WebSocketIssuerRegistry from '../src/parts/WebSocketIssuerRegistry/WebSocketIssuerRegistry.ts'

const issuerRegex = /^[A-Za-z0-9_-]{43}$/

afterEach(() => {
  jest.useRealTimers()
  WebSocketIssuerRegistry.clear()
})

test('creates a 256-bit issuer that expires after 24 hours', () => {
  jest.useFakeTimers({ now: 1_000 })
  const issuer = WebSocketIssuerRegistry.create()

  expect(issuer).toMatch(issuerRegex)
  expect(WebSocketIssuerRegistry.isValid(issuer)).toBe(true)

  jest.setSystemTime(1_000 + WebSocketIssuerRegistry.issuerTtl + 1)
  expect(WebSocketIssuerRegistry.isValid(issuer)).toBe(false)
})
