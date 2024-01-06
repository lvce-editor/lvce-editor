import { jest } from '@jest/globals'
import { IpcError } from '../src/parts/IpcError/IpcError.js'

jest.unstable_mockModule('../src/parts/WebSocketServer/WebSocketServer.js', () => {
  return {
    handleUpgrade: jest.fn(() => {
      return {
        pause: jest.fn(),
        readyState: 1,
      }
    }),
  }
})

const IpcChildWithWebSocket = await import('../src/parts/IpcChildWithWebSocket/IpcChildWithWebSocket.js')
const WebSocketServer = await import('../src/parts/WebSocketServer/WebSocketServer.js')

test('listen - missing request', async () => {
  const request = undefined
  const handle = {}
  await expect(
    IpcChildWithWebSocket.listen({
      request,
      handle,
    }),
  ).rejects.toThrow(new IpcError('request must be defined'))
})

test('listen - missing handle', async () => {
  const request = {}
  const handle = undefined
  await expect(
    IpcChildWithWebSocket.listen({
      request,
      handle,
    }),
  ).rejects.toThrow(new IpcError('handle must be defined'))
})

test('listen', async () => {
  const request = {}
  const handle = {}
  const webSocket = await IpcChildWithWebSocket.listen({
    request,
    handle,
  })
  expect(webSocket).toBeDefined()
  expect(WebSocketServer.handleUpgrade).toHaveBeenCalledTimes(1)
  expect(WebSocketServer.handleUpgrade).toHaveBeenCalledWith({}, {})
})
