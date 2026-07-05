import { expect, test } from '@jest/globals'
import * as IsAllowedWebSocketOrigin from '../src/parts/IsAllowedWebSocketOrigin/IsAllowedWebSocketOrigin.js'

test('isAllowedWebSocketOrigin - same host', () => {
  expect(
    IsAllowedWebSocketOrigin.isAllowedWebSocketOrigin({
      headers: {
        host: 'localhost:3000',
        origin: 'http://localhost:3000',
      },
    }),
  ).toBe(true)
})

test('isAllowedWebSocketOrigin - forwarded host', () => {
  expect(
    IsAllowedWebSocketOrigin.isAllowedWebSocketOrigin({
      headers: {
        host: '127.0.0.1:3000',
        origin: 'https://example-codespace-3000.app.github.dev',
        'x-forwarded-host': 'internal.example, example-codespace-3000.app.github.dev',
      },
    }),
  ).toBe(true)
})

test('isAllowedWebSocketOrigin - missing origin', () => {
  expect(
    IsAllowedWebSocketOrigin.isAllowedWebSocketOrigin({
      headers: {
        host: 'localhost:3000',
      },
    }),
  ).toBe(false)
})

test('isAllowedWebSocketOrigin - malformed origin', () => {
  expect(
    IsAllowedWebSocketOrigin.isAllowedWebSocketOrigin({
      headers: {
        host: 'localhost:3000',
        origin: '://localhost:3000',
      },
    }),
  ).toBe(false)
})

test('isAllowedWebSocketOrigin - null origin', () => {
  expect(
    IsAllowedWebSocketOrigin.isAllowedWebSocketOrigin({
      headers: {
        host: 'localhost:3000',
        origin: 'null',
      },
    }),
  ).toBe(false)
})

test('isAllowedWebSocketOrigin - non-http origin', () => {
  expect(
    IsAllowedWebSocketOrigin.isAllowedWebSocketOrigin({
      headers: {
        host: 'localhost:3000',
        origin: 'file:///test/index.html',
      },
    }),
  ).toBe(false)
})

test('isAllowedWebSocketOrigin - mismatched origin', () => {
  expect(
    IsAllowedWebSocketOrigin.isAllowedWebSocketOrigin({
      headers: {
        host: 'localhost:3000',
        origin: 'https://evil.example.com',
      },
    }),
  ).toBe(false)
})

test('isAllowedWebSocketOrigin - same hostname with different port', () => {
  expect(
    IsAllowedWebSocketOrigin.isAllowedWebSocketOrigin({
      headers: {
        host: 'localhost:3000',
        origin: 'http://localhost:3001',
      },
    }),
  ).toBe(false)
})
