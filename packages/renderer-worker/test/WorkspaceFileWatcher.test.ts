import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'

const addEventListener = jest.fn()
const removeEventListener = jest.fn()
const watcher = {
  addEventListener,
  removeEventListener,
}
const getWorkspaceUri = jest.fn(() => 'file:///workspace')
const getPreference = jest.fn((_key: string) => false)

jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({
  execute: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/FileWatcher/FileWatcher.js', () => ({
  dispose: jest.fn(),
  watch: jest.fn(() => watcher),
}))

jest.unstable_mockModule('../src/parts/Preferences/Preferences.js', () => ({
  get: getPreference,
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
  getPreference.mockReturnValue(false)
})

afterEach(() => {
  jest.useRealTimers()
})

test('hydrate - does not watch the current file workspace by default', async () => {
  await WorkspaceFileWatcher.hydrate()

  expect(FileWatcher.watch).not.toHaveBeenCalled()
  expect(GlobalEventBus.state.listenerMap['workspace.change']).toBeDefined()
})

test('hydrate - watches the current file workspace when enabled', async () => {
  getPreference.mockReturnValue(true)

  await WorkspaceFileWatcher.hydrate()

  expect(getPreference).toHaveBeenCalledWith('files.workspaceWatcher.enabled')
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

test('workspace change - watches the new workspace uri and refreshes the source control badge count', async () => {
  getPreference.mockReturnValue(true)
  await WorkspaceFileWatcher.hydrate()
  getWorkspaceUri.mockReturnValue('file:///other')
  const handleWorkspaceChange = GlobalEventBus.state.listenerMap['workspace.change'][0]

  await handleWorkspaceChange('/other')

  expect(FileWatcher.watch).toHaveBeenLastCalledWith({
    exclude: ['.git', 'node_modules'],
    roots: ['file:///other'],
  })
  expect(Command.execute).toHaveBeenCalledWith('Layout.refreshSourceControlBadgeCount')
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
  expect(Command.execute).toHaveBeenCalledWith('Layout.handleWorkspaceRefresh', {
    changed: ['file:///workspace/new.txt'],
    deleted: ['file:///workspace/deleted.txt'],
  })
  expect(Command.execute).toHaveBeenCalledWith('Layout.refreshSourceControlBadgeCount')
})

test('watchWorkspace - skips non-file workspaces', async () => {
  await WorkspaceFileWatcher.watchWorkspace('github://owner/repository')

  expect(FileWatcher.watch).not.toHaveBeenCalled()
})

test('watches connected remote server workspaces without enabling local filesystem watching', async () => {
  getWorkspaceUri.mockReturnValue('remote-server://host/home/project')
  await WorkspaceFileWatcher.hydrate()
  expect(FileWatcher.watch).toHaveBeenCalledWith({ exclude: ['.git', 'node_modules'], roots: ['remote-server://host/home/project'] })
})

test('a late remote watcher is disposed after switching workspace', async () => {
  const { promise, resolve } = Promise.withResolvers<any>()
  const oldWatcher = { addEventListener: jest.fn(), removeEventListener: jest.fn() }
  jest.mocked(FileWatcher.watch).mockImplementationOnce(() => promise)
  const first = WorkspaceFileWatcher.watchWorkspace('remote-server://old/home/project')
  await Promise.resolve()
  await WorkspaceFileWatcher.watchWorkspace('remote-server://new/home/project')
  resolve(oldWatcher)
  await first
  expect(FileWatcher.dispose).toHaveBeenCalledWith(oldWatcher)
  expect(oldWatcher.addEventListener).not.toHaveBeenCalled()
  await WorkspaceFileWatcher.dispose()
  expect(FileWatcher.dispose).toHaveBeenLastCalledWith(watcher)
})

test('disposing while a watcher is registering closes the late watcher', async () => {
  const { promise, resolve } = Promise.withResolvers<any>()
  const lateWatcher = { addEventListener: jest.fn(), removeEventListener: jest.fn() }
  jest.mocked(FileWatcher.watch).mockImplementationOnce(() => promise)
  const pending = WorkspaceFileWatcher.watchWorkspace('remote-server://old/home/project')
  await Promise.resolve()
  await WorkspaceFileWatcher.dispose()
  resolve(lateWatcher)
  await pending
  expect(FileWatcher.dispose).toHaveBeenCalledWith(lateWatcher)
  expect(lateWatcher.addEventListener).not.toHaveBeenCalled()
})
