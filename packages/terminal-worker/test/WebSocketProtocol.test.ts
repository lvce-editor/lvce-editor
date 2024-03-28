import { expect, test } from '@jest/globals'
import * as Protocol from '../src/parts/Protocol/Protocol.ts'
import * as WebSocketProtocol from '../src/parts/WebSocketProtocol/WebSocketProtocol.ts'

test('https', async () => {
  globalThis.location = {
    protocol: Protocol.Https,
  } as WorkerLocation
  expect(WebSocketProtocol.getWebSocketProtocol()).toBe(Protocol.Wss)
})

test('http', async () => {
  globalThis.location = {
    protocol: Protocol.Http,
  } as WorkerLocation
  expect(WebSocketProtocol.getWebSocketProtocol()).toBe(Protocol.Ws)
})
