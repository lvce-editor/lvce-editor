import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/IsGitpod/IsGitpod.ts', () => ({
  isGitpod: false,
}))

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({
  invoke: jest.fn(),
}))
jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => ({
  invoke: jest.fn(),
}))
jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => ({
  getPlatform: jest.fn(),
}))
jest.unstable_mockModule('../src/parts/SimpleBrowserOverlay/SimpleBrowserOverlay.js', () => ({
  hide: jest.fn(),
}))

const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')
const Platform = await import('../src/parts/Platform/Platform.js')
const PlatformType = await import('../src/parts/PlatformType/PlatformType.js')
const SimpleBrowserOverlay = await import('../src/parts/SimpleBrowserOverlay/SimpleBrowserOverlay.js')
const WebView = await import('../src/parts/WebView/WebView.ts')

beforeEach(() => {
  jest.resetAllMocks()
})

test('restores the browser after the menu worker closes the menu for an action', async () => {
  await WebView.compat.rendererProcessInvoke('Menu.hide', false)

  expect(RendererProcess.invoke).toHaveBeenCalledWith('Menu.hide', false)
  expect(SimpleBrowserOverlay.hide).toHaveBeenCalledWith('menu')
  expect(jest.mocked(RendererProcess.invoke).mock.invocationCallOrder[0]).toBeLessThan(
    jest.mocked(SimpleBrowserOverlay.hide).mock.invocationCallOrder[0],
  )
})

test('keeps the snapshot when only a submenu closes', async () => {
  await WebView.compat.rendererProcessInvoke('Menu.hideSubMenu', 1)

  expect(RendererProcess.invoke).toHaveBeenCalledWith('Menu.hideSubMenu', 1)
  expect(SimpleBrowserOverlay.hide).not.toHaveBeenCalled()
})

test('does not invoke the shared process on web', async () => {
  jest.mocked(Platform.getPlatform).mockReturnValue(PlatformType.Web)

  await expect(WebView.compat.sharedProcessInvoke('ExtensionManagement.getExtensions')).resolves.toBeUndefined()

  expect(SharedProcess.invoke).not.toHaveBeenCalled()
})

test('invokes the shared process on supported platforms', async () => {
  jest.mocked(Platform.getPlatform).mockReturnValue(PlatformType.Electron)

  await WebView.compat.sharedProcessInvoke('ExtensionManagement.getExtensions')

  expect(SharedProcess.invoke).toHaveBeenCalledWith('ExtensionManagement.getExtensions')
})
