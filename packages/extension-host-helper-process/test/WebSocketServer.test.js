import { jest } from '@jest/globals'

jest.unstable_mockModule('ws', () => {
  return {
    WebSocketServer: class {
      handleUpgrade(message, handle, buffer, callback) {
        callback({
          __isWebSocket: true,
        })
      }
    },
  }
})

const WebSocketServer = await import('../src/parts/WebSocketServer/WebSocketServer.js')

test('getWebSocket', async () => {
  const webSocket = await WebSocketServer.handleUpgrade()
  expect(webSocket).toEqual({ __isWebSocket: true })
})
