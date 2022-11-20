import * as CreateWebSocketIpc from '../src/parts/CreateWebSocketIpc/CreateWebSocketIpc.js'
import { jest } from '@jest/globals'

test('createWebSocketIpc - send', () => {
  const webSocket = {
    send: jest.fn(),
  }
  const ipc = CreateWebSocketIpc.createWebSocketIpc(webSocket)
  ipc.send({ x: 42 })
  expect(webSocket.send).toHaveBeenCalledTimes(1)
  expect(webSocket.send).toHaveBeenCalledWith('{"x":42}')
})

// TODO
test.skip('createWebSocketIpc - onmessage - error - invalid json', () => {
  let _listener = (message) => {}
  const webSocket = {
    on(event, listener) {
      _listener = listener
    },
  }
  const ipc = CreateWebSocketIpc.createWebSocketIpc(webSocket)
  const handleMessage = jest.fn()
  ipc.on('message', handleMessage)
  _listener('{"x":42')
})

test('createWebSocketIpc - onmessage', () => {
  let _listener = (message) => {}
  const webSocket = {
    on(event, listener) {
      _listener = listener
    },
  }
  const ipc = CreateWebSocketIpc.createWebSocketIpc(webSocket)
  const handleMessage = jest.fn()
  ipc.on('message', handleMessage)
  _listener('{"x":42}')
  expect(handleMessage).toHaveBeenCalledTimes(1)
  expect(handleMessage).toHaveBeenCalledWith({ x: 42 })
})
