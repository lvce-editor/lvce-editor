import * as IpcChildWithWebSocket from '../src/parts/IpcChildWithWebSocket/IpcChildWithWebSocket.js'
import { jest } from '@jest/globals'

test('IpcChildWithWebSocket - send', () => {
  const webSocket = {
    send: jest.fn(),
  }
  const ipc = IpcChildWithWebSocket.wrap(webSocket)
  ipc.send({ x: 42 })
  expect(webSocket.send).toHaveBeenCalledTimes(1)
  expect(webSocket.send).toHaveBeenCalledWith('{"x":42}')
})

// TODO
test.skip('IpcChildWithWebSocket - onmessage - error - invalid json', () => {
  let _listener = (message) => {}
  const webSocket = {
    on(event, listener) {
      _listener = listener
    },
  }
  const ipc = IpcChildWithWebSocket.wrap(webSocket)
  const handleMessage = jest.fn()
  ipc.on('message', handleMessage)
  _listener('{"x":42')
})

test('IpcChildWithWebSocket - onmessage', () => {
  let _listener = (message) => {}
  const webSocket = {
    on(event, listener) {
      _listener = listener
    },
  }
  const ipc = IpcChildWithWebSocket.wrap(webSocket)
  const handleMessage = jest.fn()
  ipc.on('message', handleMessage)
  _listener('{"x":42}')
  expect(handleMessage).toHaveBeenCalledTimes(1)
  expect(handleMessage).toHaveBeenCalledWith({ x: 42 })
})
