import * as WebSocketProtocol from '../src/parts/WebSocketProtocol/WebSocketProtocol.js'

test('getWebSocketProtocol = https', () => {
  // @ts-ignore
  globalThis.location = {
    protocol: 'https:',
  }
  expect(WebSocketProtocol.getWebSocketProtocol()).toBe('wss:')
})

test('getWebSocketProtocol = http', () => {
  // @ts-ignore
  globalThis.location = {
    protocol: 'http:',
  }
  expect(WebSocketProtocol.getWebSocketProtocol()).toBe('ws:')
})
