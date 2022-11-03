import { jest } from '@jest/globals'
import { EventEmitter } from 'events'

jest.unstable_mockModule('ws', () => {
  return {
    WebSocketServer: class {
      handleUpgrade(message, socket, buffer, callback) {
        callback(socket)
      }
    },
  }
})

const IpcChildWithWebSocket = await import(
  '../src/parts/IpcChild/IpcChildWithWebSocket.js'
)
const ws = await import('ws')

const createFakeIpc = () => {
  const emitter = new EventEmitter()
  return {
    on(event, listener) {
      emitter.on(event, listener)
    },
    off(event, listener) {
      emitter.off(event, listener)
    },
    emit(event, ...args) {
      emitter.emit(event, ...args)
    },
    send: jest.fn(),
    listenerCount() {
      const eventNames = emitter.eventNames()
      let total = 0
      for (const eventName of eventNames) {
        total += emitter.listenerCount(eventName)
      }
      return total
    },
  }
}

test('listen - error - websocket expected', async () => {
  const processIpc = createFakeIpc()
  const ipcPromise = IpcChildWithWebSocket.listen(processIpc)
  processIpc.emit('message', 'abc')
  await expect(ipcPromise).rejects.toThrowError(new Error('websocket expected'))
  expect(processIpc.listenerCount()).toBe(0)
})

test('listen', async () => {
  const processIpc = createFakeIpc()
  const ipcPromise = IpcChildWithWebSocket.listen(processIpc)
  const socket = {}
  processIpc.emit('message', '', socket)
  expect(await ipcPromise).toBeDefined()
  expect(processIpc.listenerCount()).toBe(0)
})
