import { beforeEach, expect, jest, test } from '@jest/globals'

const ipc = {
  dispose: jest.fn(async () => {}),
}
const launchProcessExplorer = jest.fn(async () => ipc)

jest.unstable_mockModule('../src/parts/LaunchProcessExplorer/LaunchProcessExplorer.js', () => ({
  launchProcessExplorer,
}))

const ProcessExplorer = await import('../src/parts/ProcessExplorer/ProcessExplorer.js')

beforeEach(() => {
  ProcessExplorer.state.ipc = undefined
  ProcessExplorer.state.refCount = 0
  ipc.dispose.mockClear()
  launchProcessExplorer.mockClear()
  jest.useRealTimers()
})

test('acquire - increments ref count and launches once', async () => {
  const result1 = await ProcessExplorer.acquire()
  const result2 = await ProcessExplorer.acquire()

  expect(result1).toBe(ipc)
  expect(result2).toBe(ipc)
  expect(ProcessExplorer.state.refCount).toBe(2)
  expect(launchProcessExplorer).toHaveBeenCalledTimes(1)
})

test('decreaseRefCount - disposes process explorer when count reaches zero', async () => {
  jest.useFakeTimers()
  await ProcessExplorer.acquire()
  await ProcessExplorer.acquire()

  expect(ProcessExplorer.decreaseRefCount()).toBe(1)
  expect(ProcessExplorer.state.ipc).toBeDefined()
  expect(ipc.dispose).not.toHaveBeenCalled()

  expect(ProcessExplorer.decreaseRefCount()).toBe(0)
  expect(ProcessExplorer.state.ipc).toBeUndefined()
  await jest.runOnlyPendingTimersAsync()

  expect(ipc.dispose).toHaveBeenCalledTimes(1)
})

test('decreaseRefCount - clamps at zero', () => {
  expect(ProcessExplorer.decreaseRefCount()).toBe(0)
  expect(ProcessExplorer.state.refCount).toBe(0)
})

test('acquire - rolls back ref count when launch fails', async () => {
  jest.useFakeTimers()
  const error = new Error('Launch failed')
  launchProcessExplorer.mockRejectedValueOnce(error)

  await expect(ProcessExplorer.acquire()).rejects.toThrow(error)
  await jest.runOnlyPendingTimersAsync()

  expect(ProcessExplorer.state.refCount).toBe(0)
  expect(ProcessExplorer.state.ipc).toBeUndefined()
})

test('acquire - relaunches after ref count reaches zero', async () => {
  jest.useFakeTimers()
  await ProcessExplorer.acquire()
  ProcessExplorer.decreaseRefCount()
  await jest.runOnlyPendingTimersAsync()

  await ProcessExplorer.acquire()

  expect(launchProcessExplorer).toHaveBeenCalledTimes(2)
})
