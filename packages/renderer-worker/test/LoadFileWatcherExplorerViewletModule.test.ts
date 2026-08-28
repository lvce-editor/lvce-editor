import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/WorkspaceConnection/WorkspaceConnection.js', () => ({
  isActive: jest.fn(() => false),
}))

const LoadFileWatcherExplorerViewletModule = await import('../src/parts/LoadFileWatcherExplorerViewletModule/LoadFileWatcherExplorerViewletModule.js')
const PlatformType = await import('../src/parts/PlatformType/PlatformType.js')
const WorkspaceConnection = await import('../src/parts/WorkspaceConnection/WorkspaceConnection.js')

beforeEach(() => {
  jest.mocked(WorkspaceConnection.isActive).mockReturnValue(false)
})

test('loads unsupported viewlet on web', async () => {
  const module = await LoadFileWatcherExplorerViewletModule.loadFileWatcherExplorerViewletModule(PlatformType.Web)

  const state = module.create(7, 'file-watcher-explorer://', 1, 2, 3, 4)
  expect(module.loadContent(state)).toEqual({
    ...state,
    message: 'File Watcher Explorer is not supported on web.',
  })
  expect(module.getCommands()).toEqual({})
  expect(module.getKeyBindings()).toEqual([])
})

test('loads worker-backed viewlet on web with an active workspace connection', async () => {
  jest.mocked(WorkspaceConnection.isActive).mockReturnValue(true)

  const module = await LoadFileWatcherExplorerViewletModule.loadFileWatcherExplorerViewletModule(PlatformType.Web)

  const state = module.create(7, 'file-watcher-explorer://', 1, 2, 3, 4)
  expect(state.platform).toBe(PlatformType.Remote)
  expect(typeof module.getCommands).toBe('function')
  expect(typeof module.getKeyBindings).toBe('function')
})

test.each([PlatformType.Electron, PlatformType.Remote])('loads worker-backed viewlet on platform %s', async (platform) => {
  const module = await LoadFileWatcherExplorerViewletModule.loadFileWatcherExplorerViewletModule(platform)

  expect(typeof module.getCommands).toBe('function')
  expect(typeof module.getKeyBindings).toBe('function')
})
