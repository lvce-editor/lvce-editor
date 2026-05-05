import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/SaveState/SaveState.js', () => {
  return {
    saveViewletState: jest.fn(() => undefined),
  }
})

jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => {
  return {
    disposeFunctional: jest.fn(() => []),
    resize: jest.fn(() => []),
  }
})

jest.unstable_mockModule('../src/parts/ViewletManager/ViewletManager.js', () => {
  return {
    load: jest.fn(() => []),
  }
})

jest.unstable_mockModule('../src/parts/ViewletStates/ViewletStates.js', () => {
  return {
    getAllInstances: jest.fn(() => ({})),
    getInstance: jest.fn(() => undefined),
    getState: jest.fn(() => ({ uid: 12 })),
    setState: jest.fn(() => undefined),
  }
})

const SaveState = await import('../src/parts/SaveState/SaveState.js')
const Viewlet = await import('../src/parts/Viewlet/Viewlet.js')
const ViewletManager = await import('../src/parts/ViewletManager/ViewletManager.js')
const ViewletLayout = await import('../src/parts/ViewletLayout/ViewletLayout.ts')
const ViewletStates = await import('../src/parts/ViewletStates/ViewletStates.js')

beforeEach(() => {
  jest.resetAllMocks()
  // @ts-ignore
  SaveState.saveViewletState.mockResolvedValue(undefined)
  // @ts-ignore
  Viewlet.disposeFunctional.mockReturnValue([])
  // @ts-ignore
  Viewlet.resize.mockResolvedValue([])
  // @ts-ignore
  ViewletManager.load.mockResolvedValue([['Viewlet.createFunctionalRoot', 'Preview', 1, true]])
  // @ts-ignore
  ViewletStates.getAllInstances.mockReturnValue({})
  // @ts-ignore
  ViewletStates.getInstance.mockReturnValue(undefined)
  // @ts-ignore
  ViewletStates.getState.mockReturnValue({ uid: 12 })
})

test('loadContent enables preview sash when preview is restored', () => {
  const state = ViewletLayout.create(1)

  const result = ViewletLayout.loadContent(state, {
    Layout: {
      bounds: {
        windowWidth: 1200,
        windowHeight: 800,
      },
    },
    previewVisible: true,
    previewWidth: 400,
  })

  expect(result).toMatchObject({
    previewVisible: true,
    previewSashVisible: true,
  })
})

test('showPreview enables preview sash', async () => {
  const state = {
    ...ViewletLayout.create(1),
    activityBarVisible: true,
    activityBarWidth: 48,
    statusBarHeight: 20,
    titleBarHeight: 35,
    windowHeight: 800,
    windowWidth: 1200,
  }

  const result = await ViewletLayout.showPreview(state, 'file:///test.html')

  expect(result.newState).toMatchObject({
    previewVisible: true,
    previewSashVisible: true,
    previewUri: 'file:///test.html',
  })
})

test('hidePreview disables preview sash', async () => {
  const state = {
    ...ViewletLayout.create(1),
    activityBarVisible: true,
    activityBarWidth: 48,
    previewId: 7,
    previewSashVisible: true,
    previewVisible: true,
    statusBarHeight: 20,
    titleBarHeight: 35,
    windowHeight: 800,
    windowWidth: 1200,
  }

  const result = await ViewletLayout.hidePreview(state)

  expect(result.newState).toMatchObject({
    previewVisible: false,
    previewSashVisible: false,
  })
})