import { expect, test } from '@jest/globals'
import * as LoadProcessExplorerViewletModule from '../src/parts/LoadProcessExplorerViewletModule/LoadProcessExplorerViewletModule.js'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.js'

test('loads unsupported viewlet on web', async () => {
  const module = await LoadProcessExplorerViewletModule.loadProcessExplorerViewletModule(PlatformType.Web)

  const state = module.create(7, 'process-explorer://', 1, 2, 3, 4)
  expect(module.loadContent(state)).toEqual({
    ...state,
    message: 'Process Explorer is not supported on web.',
  })
})

test.each([PlatformType.Electron, PlatformType.Remote])('loads worker-backed viewlet on platform %s', async (platform) => {
  const module = await LoadProcessExplorerViewletModule.loadProcessExplorerViewletModule(platform)

  expect(typeof module.getCommands).toBe('function')
  expect(typeof module.getKeyBindings).toBe('function')
})
