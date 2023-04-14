import { jest } from '@jest/globals'
import EventEmitter from 'node:events'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Logger/Logger.js', () => {
  return {
    info: jest.fn(),
  }
})

jest.useFakeTimers()

const ExtensionHostRpc = await import('../src/parts/ExtensionHostRpc/ExtensionHostRpc.js')

test('create - error - extension host does not connect', async () => {
  const ipc = new EventEmitter()
  const socket = new EventEmitter()
  const rpcPromise = ExtensionHostRpc.create(ipc, socket)
  jest.runAllTimers()
  await expect(rpcPromise).rejects.toThrowError(new Error('Extension host did not connect'))
})

test('create - error - unexpected first message', async () => {
  const ipc = new EventEmitter()
  const socket = new EventEmitter()
  const rpcPromise = ExtensionHostRpc.create(ipc, socket)
  ipc.emit('message', 'abc')
  await expect(rpcPromise).rejects.toThrowError(new Error('Unexpected first message from extension host'))
})

test('create - error - exits', async () => {
  const ipc = new EventEmitter()
  const socket = new EventEmitter()
  const rpcPromise = ExtensionHostRpc.create(ipc, socket)
  ipc.emit('exit')
  await expect(rpcPromise).rejects.toThrowError(new Error('Extension Host exited with code undefined'))
})

test('create', async () => {
  const ipc = new EventEmitter()
  const socket = new EventEmitter()
  const rpcPromise = ExtensionHostRpc.create(ipc, socket)
  ipc.emit('message', 'ready')
  expect(await rpcPromise).toBeDefined()
})
