import { beforeEach, expect, jest, test } from '@jest/globals'
jest.unstable_mockModule('../src/parts/ElectronWebContentsViewFunctions/ElectronWebContentsViewFunctions.js', () => ({
  backward: jest.fn(),
  forward: jest.fn(),
  reload: jest.fn(),
  inspectElement: jest.fn(),
  copyImageAt: jest.fn(),
  toggleDevTools: jest.fn(),
}))
jest.unstable_mockModule('../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserOpenBackgroundTab.js', () => ({
  openBackgroundTab: jest.fn(async (state) => state),
}))
const functions = await import('../src/parts/ElectronWebContentsViewFunctions/ElectronWebContentsViewFunctions.js')
const { handleContextMenuAction } = await import('../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserContextMenuAction.js')
beforeEach(() => jest.clearAllMocks())
test('a delayed action targets its originating tab after selection changes', async () => {
  const state = { browserViewId: 18, tabs: [{ browserViewId: 17 }, { browserViewId: 18 }] }
  await handleContextMenuAction(state, 17, 'inspectElement', [20, 30])
  expect(functions.inspectElement).toHaveBeenCalledWith(17, 20, 30)
})
test('a closed originating tab cannot redirect an action', async () => {
  await handleContextMenuAction({ browserViewId: 18, tabs: [{ browserViewId: 18 }] }, 17, 'toggleDevTools')
  expect(functions.toggleDevTools).not.toHaveBeenCalled()
})
