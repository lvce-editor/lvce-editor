import { beforeEach, expect, jest, test } from '@jest/globals'

const ipc = {
  dispose: jest.fn(async () => {}),
}
const launchFileWatcherExplorer = jest.fn(async () => ipc)

jest.unstable_mockModule('../src/parts/LaunchFileWatcherExplorer/LaunchFileWatcherExplorer.js', () => ({
  launchFileWatcherExplorer,
}))

const FileWatcherExplorer = await import('../src/parts/FileWatcherExplorer/FileWatcherExplorer.js')

beforeEach(() => {
  FileWatcherExplorer.state.ipc = undefined
  FileWatcherExplorer.state.refCount = 0
  ipc.dispose.mockClear()
  launchFileWatcherExplorer.mockClear()
  jest.useRealTimers()
})

test('acquire - increments ref count and launches once', async () => {
  const result1 = await FileWatcherExplorer.acquire()
  const result2 = await FileWatcherExplorer.acquire()

  expect(result1).toBe(ipc)
  expect(result2).toBe(ipc)
  expect(FileWatcherExplorer.state.refCount).toBe(2)
  expect(launchFileWatcherExplorer).toHaveBeenCalledTimes(1)
})

test('decreaseRefCount - disposes process explorer when count reaches zero', async () => {
  jest.useFakeTimers()
  await FileWatcherExplorer.acquire()
  await FileWatcherExplorer.acquire()

  expect(FileWatcherExplorer.decreaseRefCount()).toBe(1)
  expect(FileWatcherExplorer.state.ipc).toBeDefined()
  expect(ipc.dispose).not.toHaveBeenCalled()

  expect(FileWatcherExplorer.decreaseRefCount()).toBe(0)
  expect(FileWatcherExplorer.state.ipc).toBeUndefined()
  await jest.runOnlyPendingTimersAsync()

  expect(ipc.dispose).toHaveBeenCalledTimes(1)
})

test('decreaseRefCount - clamps at zero', () => {
  expect(FileWatcherExplorer.decreaseRefCount()).toBe(0)
  expect(FileWatcherExplorer.state.refCount).toBe(0)
})

test('acquire - rolls back ref count when launch fails', async () => {
  jest.useFakeTimers()
  const error = new Error('Launch failed')
  launchFileWatcherExplorer.mockRejectedValueOnce(error)

  await expect(FileWatcherExplorer.acquire()).rejects.toThrow(error)
  await jest.runOnlyPendingTimersAsync()

  expect(FileWatcherExplorer.state.refCount).toBe(0)
  expect(FileWatcherExplorer.state.ipc).toBeUndefined()
})

test('acquire - relaunches after ref count reaches zero', async () => {
  jest.useFakeTimers()
  await FileWatcherExplorer.acquire()
  FileWatcherExplorer.decreaseRefCount()
  await jest.runOnlyPendingTimersAsync()

  await FileWatcherExplorer.acquire()

  expect(launchFileWatcherExplorer).toHaveBeenCalledTimes(2)
})
