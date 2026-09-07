import { beforeEach, expect, jest, test } from '@jest/globals'
const execute = jest.fn(async (..._args: unknown[]) => {})
const instances = [
  { moduleId: 'SimpleBrowser', state: { uid: 41, tabs: [{ browserViewId: 11 }] } },
  { moduleId: 'SimpleBrowser', state: { uid: 42, tabs: [{ browserViewId: 12 }] } },
]
jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({ execute }))
jest.unstable_mockModule('../src/parts/ViewletStates/ViewletStates.js', () => ({ getValues: () => instances }))
const Browser = await import('../src/parts/ElectronBrowserView/ElectronBrowserView.js')
beforeEach(() => {
  jest.clearAllMocks()
})
test('native events reach their owning browser when several areas exist', async () => {
  await Browser.handleDidNavigate(12, 'https://example.com')
  expect(execute).toHaveBeenCalledWith('Viewlet.executeViewletCommand', 42, 'handleDidNavigate', 12, 'https://example.com')
  await Browser.handleKeyBinding(11, 2088)
  expect(execute).toHaveBeenLastCalledWith('Viewlet.executeViewletCommand', 41, 'handleKeyBinding', 11, 2088)
})
test('context menus use the origin carried in their parameters', async () => {
  const params = { browserViewId: 12, x: 20, y: 30 }
  await Browser.handleContextMenu(params)
  expect(execute).toHaveBeenCalledWith('Viewlet.executeViewletCommand', 42, 'handleContextMenu', params)
})
