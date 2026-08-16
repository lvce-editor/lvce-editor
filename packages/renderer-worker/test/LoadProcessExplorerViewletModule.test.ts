import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/WorkspaceBackend/WorkspaceBackend.js', () => ({
  isActive: jest.fn(() => false),
}))

const LoadProcessExplorerViewletModule = await import('../src/parts/LoadProcessExplorerViewletModule/LoadProcessExplorerViewletModule.js')
const PlatformType = await import('../src/parts/PlatformType/PlatformType.js')
const WorkspaceBackend = await import('../src/parts/WorkspaceBackend/WorkspaceBackend.js')

beforeEach(() => {
  jest.mocked(WorkspaceBackend.isActive).mockReturnValue(false)
})

test('loads unsupported viewlet on web', async () => {
  const module = await LoadProcessExplorerViewletModule.loadProcessExplorerViewletModule(PlatformType.Web)

  const state = module.create(7, 'process-explorer://', 1, 2, 3, 4)
  expect(module.loadContent(state)).toEqual({
    ...state,
    message: 'Process Explorer is not supported on web.',
  })
  expect(module.getCommands()).toEqual({})
  expect(module.getKeyBindings()).toEqual([])
})

test('loads worker-backed viewlet on web with an active remote workspace backend', async () => {
  jest.mocked(WorkspaceBackend.isActive).mockReturnValue(true)

  const module = await LoadProcessExplorerViewletModule.loadProcessExplorerViewletModule(PlatformType.Web)

  const state = module.create(7, 'process-explorer://', 1, 2, 3, 4)
  expect(state.platform).toBe(PlatformType.Remote)
  expect(typeof module.getCommands).toBe('function')
  expect(typeof module.getKeyBindings).toBe('function')
})

test.each([PlatformType.Electron, PlatformType.Remote])('loads worker-backed viewlet on platform %s', async (platform) => {
  const module = await LoadProcessExplorerViewletModule.loadProcessExplorerViewletModule(platform)

  expect(typeof module.getCommands).toBe('function')
  expect(typeof module.getKeyBindings).toBe('function')
})
