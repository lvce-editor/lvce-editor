import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/FileWatcherProcess/FileWatcherProcess.js', () => ({
  invoke: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Id/Id.js', () => ({
  create: jest.fn(() => 123),
}))

jest.unstable_mockModule('../src/parts/JsonRpc/JsonRpc.js', () => ({
  send: jest.fn(),
}))

const FileWatcher = await import('../src/parts/FileWatcher/FileWatcher.js')
const FileWatcherProcess = await import('../src/parts/FileWatcherProcess/FileWatcherProcess.js')
const JsonRpc = await import('../src/parts/JsonRpc/JsonRpc.js')

const createIpc = (): any => {
  return {
    off: jest.fn(),
    on: jest.fn(),
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

test.each([
  { ok: true },
  {
    error: {
      code: 'ENOSPC',
      message: 'System limit for number of file watchers reached',
      name: 'Error',
    },
    ok: false,
  },
])('watch - returns file watcher process result %#', async (result) => {
  // @ts-ignore
  FileWatcherProcess.invoke.mockResolvedValue(result)
  const ipc = createIpc()
  const options = {
    exclude: ['node_modules'],
    roots: ['file:///workspace'],
  }

  await expect(FileWatcher.watch(ipc, 1, options)).resolves.toBe(result)

  expect(FileWatcherProcess.invoke).toHaveBeenCalledTimes(1)
  expect(FileWatcherProcess.invoke).toHaveBeenCalledWith('FileWatcher.watchFolders', {
    exclude: options.exclude,
    id: 123,
    roots: options.roots,
  })
})

test('dispose - disposes matching folder watcher', async () => {
  const ipc = createIpc()
  await FileWatcher.watch(ipc, 1, {
    exclude: [],
    roots: ['file:///workspace'],
  })

  await FileWatcher.dispose(ipc, 1)

  expect(ipc.off).toHaveBeenCalledWith('close', expect.any(Function))
  expect(FileWatcherProcess.invoke).toHaveBeenLastCalledWith('FileWatcher.dispose', 123)
})

test('watch - disposes folder watcher when ipc closes', async () => {
  const ipc = createIpc()
  await FileWatcher.watch(ipc, 1, {
    exclude: [],
    roots: ['file:///workspace'],
  })
  const handleClose = ipc.on.mock.calls[0][1] as () => Promise<void>

  await handleClose()

  expect(ipc.off).toHaveBeenCalledWith('close', handleClose)
  expect(FileWatcherProcess.invoke).toHaveBeenLastCalledWith('FileWatcher.dispose', 123)
})

test('handleChange - ignores events after disposal', async () => {
  const ipc = createIpc()
  await FileWatcher.watch(ipc, 1, {
    exclude: [],
    roots: ['file:///workspace'],
  })
  await FileWatcher.dispose(ipc, 1)

  FileWatcher.handleChange({
    eventName: 'add',
    id: 123,
    uri: 'file:///workspace/new.txt',
  })

  expect(JsonRpc.send).not.toHaveBeenCalled()
})
