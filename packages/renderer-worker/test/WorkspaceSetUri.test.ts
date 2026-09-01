import { beforeEach, expect, jest, test } from '@jest/globals'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

const exists = jest.fn<(uri: string) => Promise<boolean>>(async () => true)
const createNotification = jest.fn<(type: string, text: string) => Promise<void>>(async () => {})
const setWindowTitle = jest.fn<(title: string) => Promise<void>>(async () => {})
const disposeTextSearchWorker = jest.fn<() => Promise<void>>(async () => {})
const disposeFileSystemWorker = jest.fn<() => Promise<void>>(async () => {})
const isTest = jest.fn<() => boolean>(() => false)
const getPlatform = jest.fn(() => PlatformType.Test)
const setWorkspaceUri = jest.fn(async (_uri: string) => {})
const startRemoteCli = jest.fn<
  (
    connectionKey: string,
    remoteCliUrl: string,
    handleOpenRequest: (request: unknown) => Promise<void>,
  ) => Promise<void>
>(async () => {})
const stopRemoteCli = jest.fn()

jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.js', () => ({
  exists,
}))

jest.unstable_mockModule('../src/parts/Notification/Notification.js', () => ({
  create: createNotification,
}))

jest.unstable_mockModule('../src/parts/IsTest/IsTest.js', () => ({
  isTest,
  state: {
    isTest: false,
  },
}))

jest.unstable_mockModule('../src/parts/WindowTitle/WindowTitle.js', () => ({
  set: setWindowTitle,
}))

jest.unstable_mockModule('../src/parts/Product/Product.js', () => ({
  getProductNameLong: () => 'Lvce Editor',
}))

jest.unstable_mockModule('../src/parts/TextSearchWorker/TextSearchWorker.js', () => ({
  dispose: disposeTextSearchWorker,
}))

jest.unstable_mockModule('../src/parts/FileSystemWorker/FileSystemWorker.js', () => ({
  dispose: disposeFileSystemWorker,
}))

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
  getPlatform,
}))

jest.unstable_mockModule('../src/parts/Location/Location.js', () => ({
  setPathName: jest.fn(async () => {}),
  setWorkspaceUri,
}))

jest.unstable_mockModule('../src/parts/RemoteCli/RemoteCli.js', () => ({
  resolveOpenRequest: jest.fn(),
  start: startRemoteCli,
  stop: stopRemoteCli,
}))

const GlobalEventBus = await import('../src/parts/GlobalEventBus/GlobalEventBus.js')
const Workspace = await import('../src/parts/Workspace/Workspace.js')

beforeEach(() => {
  createNotification.mockClear()
  exists.mockClear()
  exists.mockResolvedValue(true)
  setWindowTitle.mockClear()
  disposeTextSearchWorker.mockClear()
  disposeFileSystemWorker.mockClear()
  isTest.mockClear()
  isTest.mockReturnValue(false)
  getPlatform.mockClear()
  getPlatform.mockReturnValue(PlatformType.Test)
  setWorkspaceUri.mockClear()
  startRemoteCli.mockClear()
  stopRemoteCli.mockClear()
  GlobalEventBus.state.listenerMap = Object.create(null)
  Workspace.state.pathSeparator = '/'
  Workspace.state.workspacePath = ''
  Workspace.state.workspaceUri = ''
})

test('setPath uses the product name for an empty workspace', async () => {
  await Workspace.setPath('')

  expect(setWindowTitle).toHaveBeenCalledWith('Lvce Editor')
  expect(disposeTextSearchWorker).toHaveBeenCalledTimes(1)
  expect(disposeFileSystemWorker).toHaveBeenCalledTimes(1)
})

test('setPath uses the folder name for a workspace', async () => {
  await Workspace.setPath('/home/test/project')

  expect(setWindowTitle).toHaveBeenCalledWith('project')
})

test('setPath skips folder validation during tests', async () => {
  isTest.mockReturnValue(true)
  exists.mockResolvedValue(false)

  await Workspace.setPath('/remote/home/test/project')

  expect(exists).not.toHaveBeenCalled()
  expect(setWindowTitle).toHaveBeenCalledWith('project')
})

test('setPath preserves the current workspace when the folder does not exist', async () => {
  Workspace.state.workspacePath = '/home/test/current'
  Workspace.state.workspaceUri = '/home/test/current'
  exists.mockResolvedValue(false)

  await expect(Workspace.setPath('/home/test/missing')).rejects.toThrow(new Error("Workspace folder does not exist: '/home/test/missing'"))

  expect(exists).toHaveBeenCalledWith('/home/test/missing')
  expect(createNotification).toHaveBeenCalledWith('error', "Workspace folder does not exist: '/home/test/missing'")
  expect(setWindowTitle).not.toHaveBeenCalled()
  expect(disposeTextSearchWorker).not.toHaveBeenCalled()
  expect(Workspace.getWorkspacePath()).toBe('/home/test/current')
  expect(Workspace.getWorkspaceUri()).toBe('/home/test/current')
})

test('setUri preserves the uri and decodes the workspace path', async () => {
  await Workspace.setUri('file:///home/test/my%20folder/%23project%3F')

  expect(Workspace.getWorkspacePath()).toBe('/home/test/my folder/#project?')
  expect(Workspace.getWorkspaceUri()).toBe('file:///home/test/my%20folder/%23project%3F')
  expect(Workspace.state.pathSeparator).toBe('/')
  expect(exists).toHaveBeenCalledWith('/home/test/my folder/#project?')
  expect(setWindowTitle).toHaveBeenCalledWith('#project?')
})

test('setUri preserves the current workspace when a local folder does not exist', async () => {
  Workspace.state.workspacePath = '/home/test/current'
  Workspace.state.workspaceUri = 'file:///home/test/current'
  exists.mockResolvedValue(false)

  await expect(Workspace.setUri('file:///home/test/missing%20folder')).rejects.toThrow(
    new Error("Workspace folder does not exist: '/home/test/missing folder'"),
  )

  expect(exists).toHaveBeenCalledWith('/home/test/missing folder')
  expect(createNotification).toHaveBeenCalledWith('error', "Workspace folder does not exist: '/home/test/missing folder'")
  expect(setWindowTitle).not.toHaveBeenCalled()
  expect(Workspace.getWorkspacePath()).toBe('/home/test/current')
  expect(Workspace.getWorkspaceUri()).toBe('file:///home/test/current')
})

test('setUri preserves a custom uri as the workspace path and uses slash separators', async () => {
  await Workspace.setUri('remote-ssh:///test-folder', '\\')

  expect(Workspace.getWorkspacePath()).toBe('remote-ssh:///test-folder')
  expect(Workspace.getWorkspaceUri()).toBe('remote-ssh:///test-folder')
  expect(Workspace.state.pathSeparator).toBe('/')
})

test('setUri uses the workspace connection path', async () => {
  await Workspace.setUri('workspace-provider://host/work', {
    command: 'workspace-provider.getWebSocketUrl',
    remoteCliUrl: 'wss://workspace.example.com/websocket/shared-process',
    workspacePath: '/work',
  })

  expect(Workspace.getWorkspacePath()).toBe('/work')
  expect(Workspace.getWorkspaceUri()).toBe('workspace-provider://host/work')
  expect(Workspace.state.pathSeparator).toBe('/')
  expect(startRemoteCli).toHaveBeenCalledWith(
    'wss://workspace.example.com/websocket/shared-process',
    'wss://workspace.example.com/websocket/shared-process',
    expect.any(Function),
  )
})

test('setUri persists the workspace uri in an Electron window', async () => {
  getPlatform.mockReturnValue(PlatformType.Electron)

  await Workspace.setUri('workspace-provider://host/work', {
    command: 'workspace-provider.getWebSocketUrl',
    remoteCliUrl: 'wss://workspace.example.com/websocket/shared-process',
    workspacePath: '/work',
  })

  expect(setWorkspaceUri).toHaveBeenCalledWith('workspace-provider://host/work')
})
