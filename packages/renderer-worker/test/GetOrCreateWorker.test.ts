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
