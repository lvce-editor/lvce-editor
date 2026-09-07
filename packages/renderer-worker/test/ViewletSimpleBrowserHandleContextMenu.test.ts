import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/ElectronContextMenu/ElectronContextMenu.js', () => ({ openBrowserContextMenu: jest.fn() }))
jest.unstable_mockModule('../src/parts/GetWindowZoomLevel/GetWindowZoomLevel.js', () => ({ getWindowZoomLevel: jest.fn(async () => 1) }))
const ElectronContextMenu = await import('../src/parts/ElectronContextMenu/ElectronContextMenu.js')
const { handleContextMenu } = await import('../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserHandleContextMenu.js')
beforeEach(() => jest.clearAllMocks())
const state = { uid: 42, x: 100, y: 50, headerHeight: 65, tabs: [{ browserViewId: 17, canGoBack: false, canGoForward: true }] }

test('captures origin and keeps inspection coordinates separate from zoomed menu placement', async () => {
  await handleContextMenu(state, { browserViewId: 17, x: 20, y: 30 })
  expect(ElectronContextMenu.openBrowserContextMenu).toHaveBeenCalledWith(
    140,
    168,
    expect.arrayContaining([
      expect.objectContaining({
        id: 'inspect-element',
        command: 'Viewlet.executeViewletCommand',
        args: [42, 'handleContextMenuAction', 17, 'inspectElement', [20, 30]],
      }),
      expect.objectContaining({ id: 'toggle-developer-tools', args: [42, 'handleContextMenuAction', 17, 'toggleDevTools', []] }),
    ]),
    17,
  )
})

test('ignores broadcast context menus belonging to another browser', async () => {
  await expect(handleContextMenu(state, { browserViewId: 18, x: 20, y: 30 })).resolves.toBe(state)
  expect(ElectronContextMenu.openBrowserContextMenu).not.toHaveBeenCalled()
})
