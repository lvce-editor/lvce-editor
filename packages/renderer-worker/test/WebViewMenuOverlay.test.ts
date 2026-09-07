import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/IsGitpod/IsGitpod.ts', () => ({
  isGitpod: false,
}))

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({
  invoke: jest.fn(),
}))
jest.unstable_mockModule('../src/parts/SimpleBrowserOverlay/SimpleBrowserOverlay.js', () => ({
  hide: jest.fn(),
}))

const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const SimpleBrowserOverlay = await import('../src/parts/SimpleBrowserOverlay/SimpleBrowserOverlay.js')
const WebView = await import('../src/parts/WebView/WebView.ts')

beforeEach(() => {
  jest.resetAllMocks()
})

test('restores the browser after the menu worker closes the menu for an action', async () => {
  await WebView.compat.rendererProcessInvoke('Menu.hide', false)

  expect(RendererProcess.invoke).toHaveBeenCalledWith('Menu.hide', false)
  expect(SimpleBrowserOverlay.hide).toHaveBeenCalledWith('menu')
  expect(RendererProcess.invoke.mock.invocationCallOrder[0]).toBeLessThan(SimpleBrowserOverlay.hide.mock.invocationCallOrder[0])
})

test('keeps the snapshot when only a submenu closes', async () => {
  await WebView.compat.rendererProcessInvoke('Menu.hideSubMenu', 1)

  expect(RendererProcess.invoke).toHaveBeenCalledWith('Menu.hideSubMenu', 1)
  expect(SimpleBrowserOverlay.hide).not.toHaveBeenCalled()
})
