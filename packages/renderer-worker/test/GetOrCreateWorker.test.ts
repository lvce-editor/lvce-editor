import { expect, jest, test } from '@jest/globals'
import * as GetOrCreateWorker from '../src/parts/GetOrCreateWorker/GetOrCreateWorker.js'
import * as JsonRpc from '../src/parts/JsonRpc/JsonRpc.js'

test('dispose does not launch an unused worker', async () => {
  const launch = jest.fn()
  const worker = GetOrCreateWorker.getOrCreateWorker(launch)

  await worker.dispose()

  expect(launch).not.toHaveBeenCalled()
})

test('reports whether the worker has been created', async () => {
  const launch = jest.fn(async () => ({
    send(message: any) {
      JsonRpc.resolve(message.id, { id: message.id, jsonrpc: '2.0', result: undefined })
    },
  }))
  const worker = GetOrCreateWorker.getOrCreateWorker(launch)

  expect(worker.isCreated()).toBe(false)

  await worker.invoke('test')

  expect(worker.isCreated()).toBe(true)
})


test('terminates the sandbox before closing its transport and relaunches on demand', async () => {
  const ipc = {
    dispose: jest.fn(),
    send: jest.fn((message: any) => {
      if (message.id) JsonRpc.resolve(message.id, { id: message.id, jsonrpc: '2.0', result: undefined })
    }),
  }
  const launch = jest.fn(async () => ipc)
  const worker = GetOrCreateWorker.getOrCreateWorker(launch, 'SandBox.terminate')
  await worker.invoke('test')
  await worker.dispose()
  expect(ipc.send).toHaveBeenLastCalledWith({ jsonrpc: '2.0', method: 'SandBox.terminate', params: [] })
  expect(ipc.send.mock.invocationCallOrder.at(-1)).toBeLessThan(ipc.dispose.mock.invocationCallOrder[0])
  expect(worker.isCreated()).toBe(false)
  expect(launch).toHaveBeenCalledTimes(1)
  await worker.invoke('test')
  expect(launch).toHaveBeenCalledTimes(2)
  await worker.dispose()
})
