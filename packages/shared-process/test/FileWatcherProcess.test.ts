import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/LaunchFileWatcherProcess/LaunchFileWatcherProcess.ts', () => ({ launchFileWatcherProcess: jest.fn() }))
jest.unstable_mockModule('../src/parts/FileWatcher/FileWatcher.ts', () => ({ handleProcessClose: jest.fn() }))
const Process = await import('../src/parts/FileWatcherProcess/FileWatcherProcess.ts')
const Launch = await import('../src/parts/LaunchFileWatcherProcess/LaunchFileWatcherProcess.ts')
const Watcher = await import('../src/parts/FileWatcher/FileWatcher.ts')

beforeEach(() => {
  jest.clearAllMocks()
  Process.state.ipc = undefined
})

test('disconnect reports failure and permits a new backend connection', async () => {
  const ipc = new EventTarget()
  jest.mocked(Launch.launchFileWatcherProcess).mockResolvedValue(ipc)
  expect(await Process.getOrCreate()).toBe(ipc)
  ipc.dispatchEvent(new Event('close'))
  expect(Watcher.handleProcessClose).toHaveBeenCalledTimes(1)
  expect(Process.state.ipc).toBeUndefined()
  const next = new EventTarget()
  jest.mocked(Launch.launchFileWatcherProcess).mockResolvedValue(next)
  expect(await Process.getOrCreate()).toBe(next)
  ipc.dispatchEvent(new Event('close'))
  expect(Watcher.handleProcessClose).toHaveBeenCalledTimes(1)
})

test('failed backend launch can be retried', async () => {
  jest.mocked(Launch.launchFileWatcherProcess).mockRejectedValueOnce(new Error('failed launch'))
  await expect(Process.getOrCreate()).rejects.toThrow('failed launch')
  expect(Process.state.ipc).toBeUndefined()
  const ipc = new EventTarget()
  jest.mocked(Launch.launchFileWatcherProcess).mockResolvedValue(ipc)
  expect(await Process.getOrCreate()).toBe(ipc)
})
