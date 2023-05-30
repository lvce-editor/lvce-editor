import * as IpcChildWithNodeForkedProcess from '../src/parts/IpcChildWithNodeForkedProcess/IpcChildWithNodeForkedProcess.js'
import { jest } from '@jest/globals'

test('send', () => {
  const process = {
    send: jest.fn(),
  }
  const ipc = IpcChildWithNodeForkedProcess.wrap(process)
  ipc.send({ x: 42 })
  expect(process.send).toHaveBeenCalledTimes(1)
  expect(process.send).toHaveBeenCalledWith({ x: 42 })
})

test('onmessage', () => {
  let _listener = (message) => {}
  const process = {
    on(event, listener) {
      _listener = listener
    },
  }
  const ipc = IpcChildWithNodeForkedProcess.wrap(process)
  const handleMessage = jest.fn()
  ipc.on('message', handleMessage)
  _listener({ x: 42 })
  expect(handleMessage).toHaveBeenCalledTimes(1)
  expect(handleMessage).toHaveBeenCalledWith({ x: 42 })
})
