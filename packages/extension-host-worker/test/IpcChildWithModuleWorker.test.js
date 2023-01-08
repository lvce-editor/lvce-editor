import { jest } from '@jest/globals'
import * as IpcChildWithModuleWorker from '../src/parts/IpcChild/IpcChildWithModuleWorker.js'

test('listen', () => {
  globalThis.postMessage = jest.fn()
  IpcChildWithModuleWorker.listen()
  expect(globalThis.postMessage).toHaveBeenCalledTimes(1)
  expect(globalThis.postMessage).toHaveBeenCalledWith('ready')
})

test('send - error - Promise could not be cloned', async () => {
  globalThis.postMessage = (message) => {
    if (message === 'ready') {
      setTimeout(() => {
        // @ts-ignore
        globalThis.onmessage(
          new MessageEvent('message', {
            data: { method: 'initialize', params: [] },
          })
        )
      }, 0)
      return
    }
    throw new DOMException(
      `Failed to execute 'postMessage' on 'DedicatedWorkerGlobalScope': #<Promise> could not be cloned.`
    )
  }
  const ipc = await IpcChildWithModuleWorker.listen()
  expect(() => ipc.send(Promise.resolve())).toThrowError(
    new DOMException(
      `Failed to execute 'postMessage' on 'DedicatedWorkerGlobalScope': #<Promise> could not be cloned.`
    )
  )
})

test('send', async () => {
  globalThis.postMessage = jest.fn((message) => {
    if (message === 'ready') {
      setTimeout(() => {
        // @ts-ignore
        globalThis.onmessage(
          new MessageEvent('message', {
            data: { method: 'initialize', params: [] },
          })
        )
      }, 0)
      return
    }
  })
  const ipc = await IpcChildWithModuleWorker.listen()
  ipc.send('test')
  expect(globalThis.postMessage).toHaveBeenCalledTimes(2)
  expect(globalThis.postMessage).toHaveBeenNthCalledWith(1, 'ready')
  expect(globalThis.postMessage).toHaveBeenNthCalledWith(2, 'test')
})
