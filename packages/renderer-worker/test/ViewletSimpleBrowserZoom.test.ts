import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/ElectronWebContentsViewFunctions/ElectronWebContentsViewFunctions.js', () => ({
  setZoomLevel: jest.fn(),
}))

const ElectronWebContentsViewFunctions = await import('../src/parts/ElectronWebContentsViewFunctions/ElectronWebContentsViewFunctions.js')
const ViewletSimpleBrowserZoom = await import('../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserZoom.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test('zooms the active browser tab in', async () => {
  const state = {
    browserViewId: 12,
    selectedTabIndex: 0,
    tabs: [{ browserViewId: 12, zoomLevel: 0 }],
    zoomLevel: 0,
  }

  const newState = await ViewletSimpleBrowserZoom.zoomIn(state)

  expect(ElectronWebContentsViewFunctions.setZoomLevel).toHaveBeenCalledWith(12, 0.5)
  expect(newState.zoomLevel).toBe(0.5)
  expect(newState.tabs[0].zoomLevel).toBe(0.5)
})

test('zooms the active browser tab out', async () => {
  const state = { browserViewId: 12, selectedTabIndex: 0, tabs: [{ browserViewId: 12, zoomLevel: 0 }], zoomLevel: 0 }

  const newState = await ViewletSimpleBrowserZoom.zoomOut(state)

  expect(ElectronWebContentsViewFunctions.setZoomLevel).toHaveBeenCalledWith(12, -0.5)
  expect(newState.zoomLevel).toBe(-0.5)
})

test('resets the active browser tab zoom', async () => {
  const state = { browserViewId: 12, selectedTabIndex: 0, tabs: [{ browserViewId: 12, zoomLevel: 1 }], zoomLevel: 1 }

  const newState = await ViewletSimpleBrowserZoom.resetZoom(state)

  expect(ElectronWebContentsViewFunctions.setZoomLevel).toHaveBeenCalledWith(12, 0)
  expect(newState.zoomLevel).toBe(0)
})

test('limits page zoom to Electron safe levels', async () => {
  const zoomedIn = { browserViewId: 12, selectedTabIndex: 0, tabs: [{ browserViewId: 12, zoomLevel: 3 }], zoomLevel: 3 }
  const zoomedOut = { browserViewId: 12, selectedTabIndex: 0, tabs: [{ browserViewId: 12, zoomLevel: -3 }], zoomLevel: -3 }

  await expect(ViewletSimpleBrowserZoom.zoomIn(zoomedIn)).resolves.toBe(zoomedIn)
  await expect(ViewletSimpleBrowserZoom.zoomOut(zoomedOut)).resolves.toBe(zoomedOut)
  expect(ElectronWebContentsViewFunctions.setZoomLevel).not.toHaveBeenCalled()
})
