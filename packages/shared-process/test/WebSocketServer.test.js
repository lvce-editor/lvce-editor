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

jest.unstable_mockModule('../src/parts/IsSocket/IsSocket.js', () => ({
  isSocket: jest.fn(),
}))

const WebSocketServer = await import('../src/parts/WebSocketServer/WebSocketServer.js')
const IsSocket = await import('../src/parts/IsSocket/IsSocket.js')

test('handleUpgrade', async () => {
  const request = {}
  const socket = {}
  // @ts-ignore
  IsSocket.isSocket.mockImplementation(() => {
    return true
  })
  const webSocket = await WebSocketServer.handleUpgrade(request, socket)
  expect(webSocket).toBeDefined()
})

test('handleUpgrade - socket is not of type Socket', async () => {
  const request = {}
  const socket = {}
  // @ts-ignore
  IsSocket.isSocket.mockImplementation(() => {
    return false
  })
  await expect(WebSocketServer.handleUpgrade(request, socket)).rejects.toThrowError(new TypeError('socket must be of type Socket'))
})

// TODO test for upgrade error
