import { expect, jest, test } from '@jest/globals'
import { EventEmitter } from 'node:events'
import * as ShutdownTerminalProcess from '../src/parts/ShutdownTerminalProcess/ShutdownTerminalProcess.ts'

test('shutdown targets the connected process and waits for its actual close', async () => {
  const ipc = Object.assign(new EventEmitter(), { send: jest.fn() })
  const closed = jest.fn()
  const stopping = ShutdownTerminalProcess.shutdownTerminalProcess(ipc)
  void stopping.then(closed)
  expect(ipc.send).toHaveBeenCalledWith({ jsonrpc: '2.0', method: 'TerminalProcess.dispose', params: [] })
  await Promise.resolve()
  expect(closed).not.toHaveBeenCalled()
  ipc.emit('close')
  await stopping
  expect(ipc.listenerCount('close')).toBe(0)
})

test('failed shutdown send removes the listener and rejects', async () => {
  const ipc = Object.assign(new EventEmitter(), {
    send: () => {
      throw new Error('disconnected')
    },
  })
  await expect(ShutdownTerminalProcess.shutdownTerminalProcess(ipc)).rejects.toThrow('disconnected')
  expect(ipc.listenerCount('close')).toBe(0)
})

test('Node forked process EventTarget transport is supported', async () => {
  const ipc = Object.assign(new EventTarget(), { send: jest.fn() })
  const stopping = ShutdownTerminalProcess.shutdownTerminalProcess(ipc)
  ipc.dispatchEvent(new Event('close'))
  await stopping
  expect(ipc.send).toHaveBeenCalledTimes(1)
})
