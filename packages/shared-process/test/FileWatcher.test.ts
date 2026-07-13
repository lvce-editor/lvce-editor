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
  const ipc = {}
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
