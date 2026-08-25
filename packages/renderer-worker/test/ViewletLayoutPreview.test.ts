import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/SaveState/SaveState.js', () => {
  return {
    saveViewletState: jest.fn(() => undefined),
    saveViewletStateWithStorageId: jest.fn(() => undefined),
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
const SideBarLocationType = await import('../src/parts/SideBarLocationType/SideBarLocationType.js')
const LayoutPoints = await import('../src/parts/ViewletLayout/LayoutPoints.ts')
const ViewletLayout = await import('../src/parts/ViewletLayout/ViewletLayout.ts')
const ViewletStates = await import('../src/parts/ViewletStates/ViewletStates.js')

beforeEach(() => {
  jest.resetAllMocks()
  // @ts-ignore
  SaveState.saveViewletState.mockResolvedValue(undefined)
  // @ts-ignore
  SaveState.saveViewletStateWithStorageId.mockResolvedValue(undefined)
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
    previewViewletId: 'Preview',
  })
})

test('loadContent restores both preview areas independently', () => {
  const state = ViewletLayout.create(1)

  const result = ViewletLayout.loadContent(state, {
    Layout: {
      bounds: {
        windowWidth: 1200,
        windowHeight: 800,
      },
    },
    previewUri: 'simple-browser://',
    previewViewletId: 'SimpleBrowser',
    previewVisible: true,
    previewWidth: 400,
    secondaryPreviewUri: 'gpt-voice.views.default',
    secondaryPreviewVisible: true,
    secondaryPreviewWidth: 400,
  })
  expect(result).toMatchObject({
    previewLeft: 400,
    previewSashVisible: true,
    previewUri: 'simple-browser://',
    previewVisible: true,
    secondaryPreviewLeft: 800,
    secondaryPreviewSashVisible: true,
    secondaryPreviewUri: 'gpt-voice.views.default',
    secondaryPreviewVisible: true,
  })
})

test('loadContent restores vertically stacked preview areas', () => {
  const state = ViewletLayout.create(1)

  const result = ViewletLayout.loadContent(state, {
    Layout: {
      bounds: {
        windowWidth: 1200,
        windowHeight: 800,
      },
    },
    previewHeight: 300,
    previewOrientation: 'vertical',
    previewVisible: true,
    previewWidth: 400,
    secondaryPreviewVisible: true,
    secondaryPreviewWidth: 400,
  })

  expect(result).toMatchObject({
    previewHeight: 300,
    previewLeft: 800,
    previewOrientation: 'vertical',
    previewTop: 20,
    previewWidth: 400,
    secondaryPreviewHeight: 480,
    secondaryPreviewLeft: 800,
    secondaryPreviewTop: 320,
    secondaryPreviewWidth: 400,
  })
  expect(ViewletLayout.saveState(result)).toMatchObject({
    previewHeight: 300,
    previewOrientation: 'vertical',
  })
})

test('loadSecondaryPreviewIfVisible restores the simple browser in the secondary preview', async () => {
  const state = ViewletLayout.create(1)

  const result = ViewletLayout.loadContent(state, {
    Layout: {
      bounds: {
        windowWidth: 1200,
        windowHeight: 800,
      },
    },
    secondaryPreviewUri: 'simple-browser://12',
    secondaryPreviewViewletId: 'SimpleBrowser',
    secondaryPreviewVisible: true,
    secondaryPreviewWidth: 400,
  })

  expect(result).toMatchObject({
    secondaryPreviewUri: 'simple-browser://12',
    secondaryPreviewViewletId: 'SimpleBrowser',
    secondaryPreviewVisible: true,
  })
  // @ts-ignore
  ViewletStates.getState.mockReturnValue(result)

  await ViewletLayout.loadSecondaryPreviewIfVisible(result)

  expect(ViewletManager.load).toHaveBeenCalledWith(
    expect.objectContaining({
      id: 'SimpleBrowser',
      uri: 'simple-browser://12',
    }),
    false,
    true,
    undefined,
  )
})

test('loadPreviewIfVisible restores the simple browser preview', async () => {
  const state = ViewletLayout.loadContent(ViewletLayout.create(1), {
    Layout: {
      bounds: {
        windowWidth: 1200,
        windowHeight: 800,
      },
    },
    previewUri: 'simple-browser://',
    previewViewletId: 'SimpleBrowser',
    previewVisible: true,
    previewWidth: 400,
  })
  // @ts-ignore
  ViewletStates.getState.mockReturnValue(state)

  await ViewletLayout.loadPreviewIfVisible(state)

  expect(ViewletManager.load).toHaveBeenCalledWith(
    expect.objectContaining({
      id: 'SimpleBrowser',
      uri: 'simple-browser://',
    }),
    false,
    true,
    undefined,
  )
  expect(Viewlet.resize).not.toHaveBeenCalled()
})

test('loadSecondaryPreviewIfVisible restores its extension view', async () => {
  const state = ViewletLayout.loadContent(ViewletLayout.create(1), {
    Layout: {
      bounds: {
        windowWidth: 1200,
        windowHeight: 800,
      },
    },
    secondaryPreviewUri: 'gpt-voice.views.default',
    secondaryPreviewVisible: true,
    secondaryPreviewWidth: 400,
  })
  // @ts-ignore
  ViewletStates.getState.mockReturnValue(state)

  await ViewletLayout.loadSecondaryPreviewIfVisible(state)

  expect(ViewletManager.load).toHaveBeenCalledWith(
    expect.objectContaining({
      id: 'ExtensionView',
      uri: 'gpt-voice.views.default',
      width: 400,
      x: 800,
    }),
    false,
    true,
    undefined,
  )
})

test('loadPreviewIfVisible uses the latest preview bounds when the window is resized during restore', async () => {
  const state = ViewletLayout.loadContent(ViewletLayout.create(1), {
    Layout: {
      bounds: {
        windowWidth: 1200,
        windowHeight: 800,
      },
    },
    previewUri: 'simple-browser://',
    previewViewletId: 'SimpleBrowser',
    previewVisible: true,
    previewWidth: 400,
  })
  const latestState = LayoutPoints.getPoints({
    ...state,
    windowWidth: 1600,
    windowHeight: 900,
  })
  // @ts-ignore
  ViewletStates.getState.mockReturnValue(latestState)

  const result = await ViewletLayout.loadPreviewIfVisible(state)
  // @ts-ignore
  const loadedViewlet = ViewletManager.load.mock.calls[0][0]
  const latestBounds = {
    x: latestState.previewLeft,
    y: latestState.previewTop,
    width: latestState.previewWidth,
    height: latestState.previewHeight,
  }

  expect(Viewlet.resize).toHaveBeenCalledWith(loadedViewlet.uid, latestBounds)
  expect(result.newState).toMatchObject({
    previewHeight: latestBounds.height,
    previewLeft: latestBounds.x,
    previewTop: latestBounds.y,
    previewWidth: latestBounds.width,
  })
})

test('loadContent ignores saved layout when restore is disabled', () => {
  const state = ViewletLayout.create(1)

  const result = ViewletLayout.loadContent(state, {
    Layout: {
      bounds: {
        windowWidth: 1200,
        windowHeight: 800,
      },
    },
    panelVisible: true,
    previewVisible: true,
    restore: false,
    secondarySideBarVisible: true,
    sideBarView: 'Search',
  })

  expect(result).toMatchObject({
    panelVisible: false,
    previewVisible: false,
    restore: false,
    secondarySideBarVisible: false,
    sideBarView: 'Explorer',
    sideBarVisible: true,
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
    previewViewletId: 'Preview',
  })
})

test('showPreview opens the simple browser in the preview area', async () => {
  const state = {
    ...ViewletLayout.create(1),
    activityBarVisible: true,
    activityBarWidth: 48,
    statusBarHeight: 20,
    titleBarHeight: 35,
    windowHeight: 800,
    windowWidth: 1200,
  }

  const result = await ViewletLayout.showPreview(state, 'simple-browser://')

  expect(result.newState).toMatchObject({
    previewVisible: true,
    previewSashVisible: true,
    previewUri: 'simple-browser://',
    previewViewletId: 'SimpleBrowser',
  })
  expect(ViewletManager.load).toHaveBeenCalledWith(
    expect.objectContaining({
      id: 'SimpleBrowser',
      uri: 'simple-browser://',
    }),
    false,
    true,
    undefined,
  )
})

test('showPreview moves an open simple browser to the secondary preview before opening an html preview', async () => {
  // @ts-ignore
  ViewletStates.getInstance.mockImplementation((id) => (id === 7 ? { state: { uid: 7 } } : undefined))
  const state = LayoutPoints.getPoints({
    ...ViewletLayout.create(1),
    previewActionsEventListeners: ['click'],
    previewActionsUid: 9,
    previewId: 7,
    previewMinWidth: 100,
    previewUri: 'simple-browser://12',
    previewViewletId: 'SimpleBrowser',
    previewVisible: true,
    previewWidth: 600,
    secondaryPreviewMinWidth: 100,
    statusBarHeight: 20,
    statusBarVisible: true,
    titleBarHeight: 35,
    titleBarVisible: true,
    windowHeight: 800,
    windowWidth: 1200,
  })

  const result = await ViewletLayout.showPreview(state, 'file:///test.html')

  expect(result.newState).toMatchObject({
    previewLeft: 400,
    previewUri: 'file:///test.html',
    previewViewletId: 'Preview',
    previewVisible: true,
    previewWidth: 400,
    secondaryPreviewActionsEventListeners: ['click'],
    secondaryPreviewActionsUid: 9,
    secondaryPreviewId: 7,
    secondaryPreviewLeft: 800,
    secondaryPreviewUri: 'simple-browser://12',
    secondaryPreviewViewletId: 'SimpleBrowser',
    secondaryPreviewVisible: true,
    secondaryPreviewWidth: 400,
  })
  expect(Viewlet.disposeFunctional).not.toHaveBeenCalledWith(7)
  expect(Viewlet.disposeFunctional).not.toHaveBeenCalledWith(9)
  expect(Viewlet.resize).toHaveBeenCalledWith(7, {
    x: result.newState.secondaryPreviewLeft,
    y: result.newState.secondaryPreviewTop,
    width: result.newState.secondaryPreviewWidth,
    height: result.newState.secondaryPreviewHeight,
  })
  expect(ViewletManager.load).toHaveBeenCalledTimes(1)
  expect(ViewletManager.load).toHaveBeenCalledWith(
    expect.objectContaining({
      id: 'Preview',
      uri: 'file:///test.html',
      x: 400,
      width: 400,
    }),
    false,
    true,
    undefined,
  )
})

test.each([
  ['left', SideBarLocationType.Left],
  ['right', SideBarLocationType.Right],
])('preview uses the space below the shortened status bar with the side bar on the %s', (_name, sideBarLocation) => {
  const state = LayoutPoints.getPoints(
    {
      ...ViewletLayout.create(1),
      previewMinWidth: 100,
      previewVisible: true,
      previewWidth: 400,
      statusBarHeight: 20,
      statusBarVisible: true,
      titleBarHeight: 35,
      titleBarVisible: true,
      windowHeight: 800,
      windowWidth: 1200,
    },
    sideBarLocation,
  )

  expect(state).toMatchObject({
    previewHeight: 765,
    previewLeft: 800,
    previewTop: 35,
    previewWidth: 400,
    statusBarWidth: 800,
  })

})

test.each([
  ['left', SideBarLocationType.Left],
  ['right', SideBarLocationType.Right],
])('hidden status bar leaves the main and preview areas at full height with the side bar on the %s', (_name, sideBarLocation) => {
  const state = LayoutPoints.getPoints(
    {
      ...ViewletLayout.create(1),
      previewMinWidth: 100,
      previewVisible: true,
      previewWidth: 400,
      statusBarHeight: 20,
      statusBarVisible: false,
      titleBarHeight: 35,
      titleBarVisible: true,
      windowHeight: 800,
      windowWidth: 1200,
    },
    sideBarLocation,
  )

  expect(state).toMatchObject({
    mainHeight: 765,
    previewHeight: 765,
    statusBarTop: 800,
  })
})

test.each([
  ['left', SideBarLocationType.Left],
  ['right', SideBarLocationType.Right],
])('primary and secondary previews form three columns with the side bar on the %s', (_name, sideBarLocation) => {
  const state = LayoutPoints.getPoints(
    {
      ...ViewletLayout.create(1),
      previewMinWidth: 100,
      previewVisible: true,
      previewWidth: 400,
      secondaryPreviewMinWidth: 100,
      secondaryPreviewVisible: true,
      secondaryPreviewWidth: 400,
      statusBarHeight: 20,
      statusBarVisible: true,
      titleBarHeight: 35,
      titleBarVisible: true,
      windowHeight: 800,
      windowWidth: 1200,
    },
    sideBarLocation,
  )

  expect(state).toMatchObject({
    panelWidth: 400,
    previewLeft: 400,
    previewWidth: 400,
    secondaryPreviewLeft: 800,
    secondaryPreviewWidth: 400,
    statusBarWidth: 400,
  })
})

test.each([
  ['left', SideBarLocationType.Left],
  ['right', SideBarLocationType.Right],
])('togglePreviewOrientation stacks both previews with the side bar on the %s', async (_name, sideBarLocation) => {
  const state = LayoutPoints.getPoints(
    {
      ...ViewletLayout.create(1),
      previewMinHeight: 100,
      previewMinWidth: 100,
      previewVisible: true,
      previewWidth: 400,
      secondaryPreviewMinHeight: 100,
      secondaryPreviewMinWidth: 100,
      secondaryPreviewVisible: true,
      secondaryPreviewWidth: 400,
      statusBarHeight: 20,
      statusBarVisible: true,
      titleBarHeight: 20,
      titleBarVisible: true,
      windowHeight: 800,
      windowWidth: 1200,
    },
    sideBarLocation,
  )

  const result = await ViewletLayout.togglePreviewOrientation(state)

  expect(result.newState).toMatchObject({
    panelWidth: 800,
    previewHeight: 390,
    previewLeft: 800,
    previewOrientation: 'vertical',
    previewTop: 20,
    previewWidth: 400,
    secondaryPreviewHeight: 390,
    secondaryPreviewLeft: 800,
    secondaryPreviewTop: 410,
    secondaryPreviewWidth: 400,
    statusBarWidth: 800,
  })

  const horizontalResult = await ViewletLayout.togglePreviewOrientation(result.newState)

  expect(horizontalResult.newState).toMatchObject({
    panelWidth: 400,
    previewHeight: 780,
    previewLeft: 400,
    previewOrientation: 'horizontal',
    previewWidth: 400,
    secondaryPreviewHeight: 780,
    secondaryPreviewLeft: 800,
    secondaryPreviewTop: 20,
    secondaryPreviewWidth: 400,
    statusBarWidth: 400,
  })
})

test('resizing the divider between vertically stacked previews changes their heights', async () => {
  const state = LayoutPoints.getPoints({
    ...ViewletLayout.create(1),
    previewHeight: 300,
    previewMinHeight: 100,
    previewMinWidth: 100,
    previewOrientation: 'vertical',
    previewVisible: true,
    previewWidth: 400,
    sashId: 'SecondaryPreview',
    secondaryPreviewMinHeight: 100,
    secondaryPreviewMinWidth: 100,
    secondaryPreviewVisible: true,
    secondaryPreviewWidth: 400,
    statusBarHeight: 20,
    statusBarVisible: true,
    titleBarHeight: 20,
    titleBarVisible: true,
    windowHeight: 800,
    windowWidth: 1200,
  })

  const result = await ViewletLayout.handleSashPointerMove(state, 800, 500)

  expect(result.newState).toMatchObject({
    previewHeight: 480,
    secondaryPreviewHeight: 300,
    secondaryPreviewTop: 500,
  })
})

test('showSecondaryPreview keeps an open primary preview mounted', async () => {
  const state = LayoutPoints.getPoints({
    ...ViewletLayout.create(1),
    panelHeight: 200,
    panelMaxHeight: 600,
    panelMinHeight: 150,
    panelVisible: true,
    previewId: 7,
    previewMinWidth: 100,
    previewUri: 'simple-browser://',
    previewViewletId: 'SimpleBrowser',
    previewVisible: true,
    previewWidth: 400,
    secondaryPreviewMinWidth: 100,
    secondaryPreviewWidth: 400,
    statusBarHeight: 20,
    statusBarVisible: true,
    titleBarHeight: 35,
    titleBarVisible: true,
    windowHeight: 800,
    windowWidth: 1200,
  })

  const result = await ViewletLayout.showSecondaryPreview(state, 'gpt-voice.views.default')

  expect(result.newState).toMatchObject({
    previewId: 7,
    previewUri: 'simple-browser://',
    previewVisible: true,
    secondaryPreviewUri: 'gpt-voice.views.default',
    secondaryPreviewViewletId: 'ExtensionView',
    secondaryPreviewVisible: true,
  })
  expect(Viewlet.disposeFunctional).not.toHaveBeenCalledWith(7)
  expect(ViewletManager.load).toHaveBeenCalledWith(
    expect.objectContaining({
      id: 'ExtensionView',
      uri: 'gpt-voice.views.default',
      x: 800,
      width: 400,
    }),
    false,
    true,
    undefined,
  )
  expect(result.newState.secondaryPreviewHeight).toBe(result.newState.windowHeight - result.newState.secondaryPreviewTop)
  expect(result.commands).toContainEqual([
    'Viewlet.setBounds',
    expect.any(Number),
    0,
    0,
    result.newState.secondaryPreviewWidth,
    result.newState.secondaryPreviewHeight,
  ])
})

test('showPreview keeps code visible when voice chat is already open', async () => {
  const state = LayoutPoints.getPoints({
    ...ViewletLayout.create(1),
    panelHeight: 200,
    panelMaxHeight: 600,
    panelMinHeight: 150,
    panelVisible: true,
    previewMinWidth: 100,
    secondaryPreviewId: 8,
    secondaryPreviewMinWidth: 100,
    secondaryPreviewUri: 'gpt-voice.views.default',
    secondaryPreviewViewletId: 'ExtensionView',
    secondaryPreviewVisible: true,
    secondaryPreviewWidth: 600,
    statusBarHeight: 20,
    statusBarVisible: true,
    titleBarHeight: 35,
    titleBarVisible: true,
    windowHeight: 800,
    windowWidth: 1200,
  })

  const result = await ViewletLayout.showPreview(state, 'simple-browser://')

  expect(result.newState).toMatchObject({
    previewLeft: 400,
    previewUri: 'simple-browser://',
    previewVisible: true,
    previewWidth: 400,
    secondaryPreviewId: 8,
    secondaryPreviewLeft: 800,
    secondaryPreviewVisible: true,
    secondaryPreviewWidth: 400,
  })
  expect(Viewlet.disposeFunctional).not.toHaveBeenCalledWith(8)
  expect(result.newState.previewHeight).toBe(result.newState.windowHeight - result.newState.previewTop)
  expect(result.commands).toContainEqual([
    'Viewlet.setBounds',
    expect.any(Number),
    0,
    0,
    result.newState.previewWidth,
    result.newState.previewHeight,
  ])
})

test('hideSecondaryPreview leaves the primary preview mounted', async () => {
  const state = LayoutPoints.getPoints({
    ...ViewletLayout.create(1),
    previewId: 7,
    previewMinWidth: 100,
    previewUri: 'simple-browser://',
    previewViewletId: 'SimpleBrowser',
    previewVisible: true,
    previewWidth: 400,
    secondaryPreviewActionsUid: 9,
    secondaryPreviewId: 8,
    secondaryPreviewMinWidth: 100,
    secondaryPreviewUri: 'gpt-voice.views.default',
    secondaryPreviewViewletId: 'ExtensionView',
    secondaryPreviewVisible: true,
    secondaryPreviewWidth: 400,
    statusBarHeight: 20,
    titleBarHeight: 35,
    windowHeight: 800,
    windowWidth: 1200,
  })

  const result = await ViewletLayout.hideSecondaryPreview(state)

  expect(result.newState).toMatchObject({
    previewId: 7,
    previewUri: 'simple-browser://',
    previewVisible: true,
    secondaryPreviewActionsUid: -1,
    secondaryPreviewId: -1,
    secondaryPreviewVisible: false,
  })
  expect(Viewlet.disposeFunctional).toHaveBeenCalledWith(8)
  expect(Viewlet.disposeFunctional).toHaveBeenCalledWith(9)
  expect(Viewlet.disposeFunctional).not.toHaveBeenCalledWith(7)
})

test('resizing the primary preview preserves the secondary preview width', async () => {
  const state = LayoutPoints.getPoints({
    ...ViewletLayout.create(1),
    previewId: 7,
    previewMinWidth: 100,
    previewVisible: true,
    previewWidth: 400,
    sashId: 'Preview',
    secondaryPreviewId: 8,
    secondaryPreviewMinWidth: 100,
    secondaryPreviewVisible: true,
    secondaryPreviewWidth: 400,
    statusBarHeight: 20,
    titleBarHeight: 35,
    windowHeight: 800,
    windowWidth: 1200,
  })

  const result = await ViewletLayout.handleSashPointerMove(state, 350, 400)

  expect(result.newState).toMatchObject({
    previewLeft: 350,
    previewWidth: 450,
    secondaryPreviewLeft: 800,
    secondaryPreviewWidth: 400,
  })
})

test.each([
  ['left', SideBarLocationType.Left],
  ['right', SideBarLocationType.Right],
])('panel ends at the preview and preview uses the space beside it with the side bar on the %s', (_name, sideBarLocation) => {
  const state = LayoutPoints.getPoints(
    {
      ...ViewletLayout.create(1),
      panelHeight: 200,
      panelMaxHeight: 600,
      panelMinHeight: 150,
      panelVisible: true,
      previewMinWidth: 100,
      previewVisible: true,
      previewWidth: 400,
      statusBarHeight: 20,
      statusBarVisible: true,
      titleBarHeight: 35,
      titleBarVisible: true,
      windowHeight: 800,
      windowWidth: 1200,
    },
    sideBarLocation,
  )

  expect(state).toMatchObject({
    panelHeight: 200,
    panelLeft: 0,
    panelTop: 580,
    panelWidth: 800,
    previewHeight: 765,
    previewLeft: 800,
    previewTop: 35,
    previewWidth: 400,
  })
})

test('showPreview replaces an open file preview with the simple browser', async () => {
  const state = {
    ...ViewletLayout.create(1),
    previewHeight: 600,
    previewId: 7,
    previewLeft: 600,
    previewTop: 35,
    previewUri: 'file:///test.html',
    previewVisible: true,
    previewWidth: 600,
  }

  const result = await ViewletLayout.showPreview(state, 'simple-browser://')

  expect(SaveState.saveViewletStateWithStorageId).toHaveBeenCalledWith(7, 'Preview')
  expect(Viewlet.disposeFunctional).toHaveBeenCalledWith(7)
  expect(ViewletManager.load).toHaveBeenCalledWith(
    expect.objectContaining({
      id: 'SimpleBrowser',
      uri: 'simple-browser://',
      x: 600,
      y: 35,
      width: 600,
      height: 600,
    }),
    false,
    true,
    undefined,
  )
  expect(result.newState).toMatchObject({
    previewUri: 'simple-browser://',
    previewViewletId: 'SimpleBrowser',
    previewVisible: true,
  })
})

test('resizing the preview updates the adjoining layout and preserves its vertical position', async () => {
  const state = {
    ...ViewletLayout.create(1),
    activityBarVisible: true,
    activityBarWidth: 48,
    mainWidth: 752,
    panelVisible: true,
    panelWidth: 800,
    previewHeight: 745,
    previewId: 7,
    previewLeft: 800,
    previewMinWidth: 100,
    previewTop: 35,
    previewUri: 'simple-browser://',
    previewViewletId: 'SimpleBrowser',
    previewVisible: true,
    previewWidth: 400,
    sashId: 'Preview',
    sideBarVisible: false,
    statusBarHeight: 20,
    statusBarVisible: true,
    statusBarWidth: 800,
    titleBarHeight: 35,
    titleBarVisible: true,
    windowHeight: 800,
    windowWidth: 1200,
  }

  const result = await ViewletLayout.handleSashPointerMove(state, 700, 400)

  expect(result.newState).toMatchObject({
    activityBarLeft: 652,
    mainWidth: 652,
    panelWidth: 700,
    previewHeight: 765,
    previewLeft: 700,
    previewTop: 35,
    previewWidth: 500,
    statusBarWidth: 700,
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
    previewId: -1,
    previewVisible: false,
    previewSashVisible: false,
  })
  expect(SaveState.saveViewletStateWithStorageId).toHaveBeenCalledWith(7, 'Preview')
  expect(Viewlet.disposeFunctional).toHaveBeenCalledWith(7)
})

test('showPreview restores the resized preview width after hiding', async () => {
  const state = LayoutPoints.getPoints({
    ...ViewletLayout.create(1),
    activityBarVisible: true,
    activityBarWidth: 48,
    previewId: 7,
    previewMinWidth: 100,
    previewUri: 'file:///test.html',
    previewViewletId: 'Preview',
    previewVisible: true,
    previewWidth: 400,
    statusBarHeight: 20,
    titleBarHeight: 35,
    windowHeight: 1080,
    windowWidth: 1920,
  })

  const hidden = await ViewletLayout.hidePreview(state)
  const reopened = await ViewletLayout.showPreview(hidden.newState, 'file:///test.html')

  expect(reopened.newState).toMatchObject({
    previewLeft: 1520,
    previewVisible: true,
    previewWidth: 400,
  })
})
