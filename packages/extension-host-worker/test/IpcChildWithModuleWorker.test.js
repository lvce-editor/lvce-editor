import * as IpcChildWithModuleWorker from '../src/parts/IpcChild/IpcChildWithModuleWorker.js'
import { jest } from '@jest/globals'

test('listen', () => {
  globalThis.postMessage = jest.fn()
  IpcChildWithModuleWorker.listen()
  expect(globalThis.postMessage).toHaveBeenCalledTimes(1)
  expect(globalThis.postMessage).toHaveBeenCalledWith('ready')
})

test('send - error - Promise could not be cloned', () => {
  globalThis.postMessage = (message) => {
    if (message === 'ready') {
      return
    }
    throw new DOMException(
      `Failed to execute 'postMessage' on 'DedicatedWorkerGlobalScope': #<Promise> could not be cloned.`
    )
  }
  const ipc = IpcChildWithModuleWorker.listen()
  expect(() => ipc.send(Promise.resolve())).toThrowError(
    new DOMException(
      `Failed to execute 'postMessage' on 'DedicatedWorkerGlobalScope': #<Promise> could not be cloned.`
    )
  )
})

test('send', () => {
  globalThis.postMessage = jest.fn()
  const ipc = IpcChildWithModuleWorker.listen()
  ipc.send('test')
  expect(globalThis.postMessage).toHaveBeenCalledTimes(2)
  expect(globalThis.postMessage).toHaveBeenNthCalledWith(1, 'ready')
  expect(globalThis.postMessage).toHaveBeenNthCalledWith(2, 'test')
})
