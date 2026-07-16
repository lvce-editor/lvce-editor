import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'

const addEventListener = jest.fn()
const removeEventListener = jest.fn()
const watcher = {
  addEventListener,
  removeEventListener,
}
const getWorkspaceUri = jest.fn(() => 'file:///workspace')

jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({
  execute: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/FileWatcher/FileWatcher.js', () => ({
  dispose: jest.fn(),
  watch: jest.fn(() => watcher),
}))

jest.unstable_mockModule('../src/parts/Workspace/Workspace.js', () => ({
  getWorkspaceUri,
}))

const Command = await import('../src/parts/Command/Command.js')
const FileWatcher = await import('../src/parts/FileWatcher/FileWatcher.js')
const GlobalEventBus = await import('../src/parts/GlobalEventBus/GlobalEventBus.js')
const WorkspaceFileWatcher = await import('../src/parts/WorkspaceFileWatcher/WorkspaceFileWatcher.js')

beforeEach(async () => {
  jest.useFakeTimers()
  await WorkspaceFileWatcher.dispose()
  GlobalEventBus.state.listenerMap = Object.create(null)
  jest.clearAllMocks()
  getWorkspaceUri.mockReturnValue('file:///workspace')
})

afterEach(() => {
  jest.useRealTimers()
})

test('hydrate - watches the current file workspace', async () => {
  await WorkspaceFileWatcher.hydrate()

  expect(FileWatcher.watch).toHaveBeenCalledWith({
    exclude: ['.git', 'node_modules'],
    roots: ['file:///workspace'],
  })
  expect(addEventListener).toHaveBeenCalledWith('watcher-event', expect.any(Function))
})

test('watchWorkspace - replaces the previous watcher', async () => {
  await WorkspaceFileWatcher.watchWorkspace('file:///workspace')
  await WorkspaceFileWatcher.watchWorkspace('file:///other')

  expect(removeEventListener).toHaveBeenCalledWith('watcher-event', expect.any(Function))
  expect(FileWatcher.dispose).toHaveBeenCalledWith(watcher)
  expect(FileWatcher.watch).toHaveBeenLastCalledWith({
    exclude: ['.git', 'node_modules'],
    roots: ['file:///other'],
  })
})

test('workspace change - watches the new workspace uri', async () => {
  await WorkspaceFileWatcher.hydrate()
  getWorkspaceUri.mockReturnValue('file:///other')
  const handleWorkspaceChange = GlobalEventBus.state.listenerMap['workspace.change'][0]

  await handleWorkspaceChange('/other')

  expect(FileWatcher.watch).toHaveBeenLastCalledWith({
    exclude: ['.git', 'node_modules'],
    roots: ['file:///other'],
  })
})

test('watcher events - debounce refresh and forward deleted uris', async () => {
  await WorkspaceFileWatcher.watchWorkspace('file:///workspace')
  const handleEvent = addEventListener.mock.calls[0][1] as (event: any) => void

  handleEvent({
    detail: {
      eventName: 'add',
      uri: 'file:///workspace/new.txt',
    },
  })
  handleEvent({
    detail: {
      eventName: 'unlink',
      uri: 'file:///workspace/deleted.txt',
    },
  })
  await jest.runAllTimersAsync()

  expect(Command.execute).toHaveBeenCalledTimes(2)
  expect(Command.execute).toHaveBeenCalledWith('Layout.handleWorkspaceRefresh', ['file:///workspace/deleted.txt'])
  expect(Command.execute).toHaveBeenCalledWith('Layout.refreshSourceControlBadgeCount')
})

test('watchWorkspace - skips non-file workspaces', async () => {
  await WorkspaceFileWatcher.watchWorkspace('github://owner/repository')

  expect(FileWatcher.watch).not.toHaveBeenCalled()
})
