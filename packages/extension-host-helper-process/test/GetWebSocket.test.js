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

const GetWebSocket = await import('../src/parts/GetWebSocket/GetWebSocket.js')

test('getWebSocket', async () => {
  const webSocket = await GetWebSocket.getWebSocket()
  expect(webSocket).toEqual({ __isWebSocket: true })
})
