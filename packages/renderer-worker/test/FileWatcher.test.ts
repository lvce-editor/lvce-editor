import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Id/Id.js', () => ({
  create: jest.fn(() => 123),
}))

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => ({
  invoke: jest.fn(),
}))

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
