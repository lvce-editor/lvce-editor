import * as IpcChildWithParent from '../src/parts/IpcChildWithParent/IpcChildWithParent.js'
import { jest } from '@jest/globals'

test('IpcChildWithParent - send', () => {
  const process = {
    send: jest.fn(),
  }
  const ipc = IpcChildWithParent.wrap(process)
  ipc.send({ x: 42 })
  expect(process.send).toHaveBeenCalledTimes(1)
  expect(process.send).toHaveBeenCalledWith({ x: 42 })
})

test('IpcChildWithParent - onmessage', () => {
  let _listener = (message) => {}
  const process = {
    on(event, listener) {
      _listener = listener
    },
  }
  const ipc = IpcChildWithParent.wrap(process)
  const handleMessage = jest.fn()
  ipc.on('message', handleMessage)
  _listener({ x: 42 })
  expect(handleMessage).toHaveBeenCalledTimes(1)
  expect(handleMessage).toHaveBeenCalledWith({ x: 42 })
})
