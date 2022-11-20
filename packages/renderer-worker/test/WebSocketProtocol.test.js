import * as WebSocketProtocol from '../src/parts/WebSocketProtocol/WebSocketProtocol.js'
import * as Protocol from '../src/parts/Protocol/Protocol.js'

test('getWebSocketProtocol = https', () => {
  // @ts-ignore
  globalThis.location = {
    protocol: Protocol.Https,
  }
  expect(WebSocketProtocol.getWebSocketProtocol()).toBe(Protocol.Wss)
})

test('getWebSocketProtocol = http', () => {
  // @ts-ignore
  globalThis.location = {
    protocol: Protocol.Http,
  }
  expect(WebSocketProtocol.getWebSocketProtocol()).toBe(Protocol.Ws)
})
