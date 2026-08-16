import { beforeEach, expect, jest, test } from '@jest/globals'

const invoke = jest.fn(async (_method: string) => {})

jest.unstable_mockModule('../src/parts/GetOrCreateWorker/GetOrCreateWorker.js', () => ({
  getOrCreateWorker: jest.fn(() => ({
    dispose: jest.fn(),
    invoke,
    invokeAndTransfer: jest.fn(),
    restart: jest.fn(),
  })),
}))

jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.js', () => ({
  getPathSeparator: jest.fn(async () => '/'),
}))

jest.unstable_mockModule('../src/parts/WindowTitle/WindowTitle.js', () => ({
  set: jest.fn(async () => {}),
}))

const ExtensionManagementWorker = await import('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js')
const GlobalEventBus = await import('../src/parts/GlobalEventBus/GlobalEventBus.js')
const Workspace = await import('../src/parts/Workspace/Workspace.js')

beforeEach(() => {
  invoke.mockClear()
  GlobalEventBus.state.listenerMap = Object.create(null)
  Workspace.state.pathSeparator = '/'
  Workspace.state.workspacePath = '/old-workspace'
  Workspace.state.workspaceUri = '/old-workspace'
})

test('disposes extensions before changing workspace', async () => {
  ExtensionManagementWorker.hydrate()

  await Workspace.setPath('/new-workspace')

  expect(invoke).toHaveBeenCalledTimes(1)
  expect(invoke).toHaveBeenCalledWith('Extensions.disposeAllRuntimes')
})
