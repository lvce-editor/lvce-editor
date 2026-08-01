import { afterEach, expect, jest, test } from '@jest/globals'
import * as WebSocketCapabilityRegistry from '../src/parts/WebSocketCapabilityRegistry/WebSocketCapabilityRegistry.ts'

const capabilityTokenRegex = /^[A-Za-z0-9_-]{43}$/

afterEach(() => {
  jest.useRealTimers()
  WebSocketCapabilityRegistry.clear()
})

test('creates 256-bit base64url one-use tokens', () => {
  const token = WebSocketCapabilityRegistry.create('file-system-process')

  expect(token).toMatch(capabilityTokenRegex)
  expect(WebSocketCapabilityRegistry.consume(token)).toEqual(
    expect.objectContaining({
      target: 'file-system-process',
    }),
  )
  expect(WebSocketCapabilityRegistry.consume(token)).toBeUndefined()
})

test('rejects expired tokens and cleans up expired entries', () => {
  jest.useFakeTimers({ now: 1_000 })
  const expired = WebSocketCapabilityRegistry.create('shared-process')
  jest.setSystemTime(1_000 + WebSocketCapabilityRegistry.capabilityTtl + 1)

  expect(WebSocketCapabilityRegistry.consume(expired)).toBeUndefined()

  const current = WebSocketCapabilityRegistry.create('search-process')
  expect(WebSocketCapabilityRegistry.consume(current)).toEqual(expect.objectContaining({ target: 'search-process' }))
})
