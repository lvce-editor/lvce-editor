import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('ws', () => ({
  WebSocketServer: class {
    handleUpgrade(request, socket, buffer, callback) {
      callback(socket)
    }
  },
}))

const WebSocketServer = await import('../src/parts/WebSocketServer/WebSocketServer.js')

test('handleUpgrade', async () => {
  const request = {}
  const socket = {}
  const webSocket = await WebSocketServer.handleUpgrade(request, socket)
  expect(webSocket).toBeDefined()
})

// TODO test for upgrade error
