import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Id/Id.js', () => ({
  create: jest.fn(() => 123),
}))

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => ({
  invoke: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js', () => ({ invoke: jest.fn(async () => {}) }))

const ExtensionManagementWorker = await import('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js')
const FileWatcher = await import('../src/parts/FileWatcher/FileWatcher.js')
const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')

beforeEach(() => {
  jest.clearAllMocks()
})

test('dispose - disposes watcher and ignores later events', async () => {
  const listener = jest.fn()
  const watcher = await FileWatcher.watch({
    exclude: [],
    roots: ['file:///workspace'],
  })
  watcher.addEventListener('watcher-event', listener)

  await FileWatcher.dispose(watcher)
  await FileWatcher.handleEvent(123, {
    eventName: 'add',
    uri: 'file:///workspace/new.txt',
  })

  expect(SharedProcess.invoke).toHaveBeenNthCalledWith(1, 'FileWatcher.watch', 123, {
    exclude: [],
    roots: ['file:///workspace'],
  })
  expect(SharedProcess.invoke).toHaveBeenNthCalledWith(2, 'FileWatcher.dispose', 123)
  expect(listener).not.toHaveBeenCalled()
})

test('scoped watchers forward events during setup and report readiness failures', async () => {
  const { promise, resolve } = Promise.withResolvers<any>()
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async (method) => (method === 'FileWatcher.watch' ? promise : undefined))
  const pending = FileWatcher.watchExtension('extension-watch', { exclude: [], roots: ['file:///workspace'] })
  const event = { eventName: 'change', uri: 'file:///workspace/node_modules/example/index.d.ts' }
  await FileWatcher.handleEvent(123, event)
  expect(ExtensionManagementWorker.invoke).toHaveBeenCalledWith('Extensions.handleFileWatcherEvent', 'extension-watch', event)
  resolve({ ok: true })
  await pending
  await FileWatcher.disposeExtension('extension-watch')
  await FileWatcher.handleEvent(123, event)
  expect(ExtensionManagementWorker.invoke).toHaveBeenCalledTimes(1)
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async (method) =>
    method === 'FileWatcher.watch' ? { error: { message: 'ENOSPC' }, ok: false } : undefined,
  )
  await expect(FileWatcher.watchExtension('extension-watch', { roots: ['file:///workspace'] })).rejects.toThrow('ENOSPC')
})

test('disposing a scoped watch during setup cancels the registration', async () => {
  const { promise, resolve } = Promise.withResolvers<any>()
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async (method) => (method === 'FileWatcher.watch' ? promise : undefined))
  const pending = FileWatcher.watchExtension('pending-watch', { roots: ['file:///workspace'] })
  const rejected = pending.catch((error: unknown) => error)
  await FileWatcher.disposeExtension('pending-watch')
  resolve({ ok: true })
  await rejected
})

test('shared process disconnect invalidates extension watchers', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(async (method) => (method === 'FileWatcher.watch' ? { ok: true } : undefined))
  await FileWatcher.watchExtension('lost-process', { roots: ['file:///workspace'] })
  FileWatcher.handleSharedProcessClose()
  expect(ExtensionManagementWorker.invoke).toHaveBeenCalledWith(
    'Extensions.handleFileWatcherEvent',
    'lost-process',
    expect.objectContaining({ eventName: 'error' }),
  )
  await FileWatcher.disposeExtension('lost-process')
})
