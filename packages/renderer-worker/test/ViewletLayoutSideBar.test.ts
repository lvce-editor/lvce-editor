import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/ActivityBarWorker/ActivityBarWorker.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/GetExtensionViews/GetExtensionViews.ts', () => {
  return {
    getExtensionView: jest.fn(() => undefined),
  }
})

jest.unstable_mockModule('../src/parts/ViewletManager/ViewletManager.js', () => {
  return {
    load: jest.fn(() => {
      throw new Error('not implemented')
    }),
    waitForLoadContentLater: jest.fn(() => undefined),
  }
})

jest.unstable_mockModule('../src/parts/SaveState/SaveState.js', () => {
  return {
    saveViewletState: jest.fn(() => undefined),
    saveViewletStateWithStorageId: jest.fn(() => undefined),
  }
})

jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => {
  return {
    disposeFunctional: jest.fn(() => []),
    focus: jest.fn(() => undefined),
    getFocusCommands: jest.fn(() => []),
    resize: jest.fn(() => []),
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

const ActivityBarWorker = await import('../src/parts/ActivityBarWorker/ActivityBarWorker.js')
const GetExtensionViews = await import('../src/parts/GetExtensionViews/GetExtensionViews.ts')
const SaveState = await import('../src/parts/SaveState/SaveState.js')
const Viewlet = await import('../src/parts/Viewlet/Viewlet.js')
const ViewletManager = await import('../src/parts/ViewletManager/ViewletManager.js')
const LayoutPoints = await import('../src/parts/ViewletLayout/LayoutPoints.ts')
const SideBarLocationType = await import('../src/parts/SideBarLocationType/SideBarLocationType.js')
const ViewletLayout = await import('../src/parts/ViewletLayout/ViewletLayout.ts')
const ViewletStates = await import('../src/parts/ViewletStates/ViewletStates.js')

const activityBarInvokeMock = ActivityBarWorker.invoke as any
const viewletManagerLoadMock = ViewletManager.load as any

beforeEach(() => {
  jest.resetAllMocks()
  // @ts-ignore
  SaveState.saveViewletState.mockResolvedValue(undefined)
  // @ts-ignore
  SaveState.saveViewletStateWithStorageId.mockResolvedValue(undefined)
  // @ts-ignore
  GetExtensionViews.getExtensionView.mockResolvedValue(undefined)
  // @ts-ignore
  Viewlet.disposeFunctional.mockReturnValue([])
  // @ts-ignore
  Viewlet.focus.mockResolvedValue(undefined)
  // @ts-ignore
  Viewlet.getFocusCommands.mockResolvedValue([])
  // @ts-ignore
  Viewlet.resize.mockResolvedValue([])
  // @ts-ignore
  ViewletManager.waitForLoadContentLater.mockResolvedValue(undefined)
  // @ts-ignore
  ViewletStates.getAllInstances.mockReturnValue({})
  // @ts-ignore
  ViewletStates.getInstance.mockReturnValue(undefined)
  // @ts-ignore
  ViewletStates.getState.mockReturnValue({ uid: 12 })
})

test('setActionsDom creates preview actions with the child event listeners', () => {
  const state = {
    ...ViewletLayout.create(12),
    previewId: 7,
    previewViewletId: 'ExtensionView',
  }

  const result = ViewletLayout.setActionsDom(state, ['preview-actions'], 7, ['click'])

  expect(result.handled).toBe(true)
  expect(result.renderParent).toBe(true)
  expect(result.statePatch.previewActionsUid).not.toBe(-1)
  expect(result.commands).toEqual([
    ['Viewlet.createFunctionalRoot', 'ExtensionView', result.statePatch.previewActionsUid, true],
    ['Viewlet.registerEventListeners', result.statePatch.previewActionsUid, ['click']],
    ['Viewlet.setDom2', result.statePatch.previewActionsUid, ['preview-actions']],
    ['Viewlet.setUid', result.statePatch.previewActionsUid, 7],
  ])
})

test('setActionsDom keeps secondary preview actions independent', () => {
  const state = {
    ...ViewletLayout.create(12),
    previewActionsUid: 8,
    previewId: 7,
    secondaryPreviewId: 9,
    secondaryPreviewViewletId: 'ExtensionView',
  }

  const result = ViewletLayout.setActionsDom(state, ['voice-actions'], 9, ['click'])

  expect(result.statePatch).toEqual({
    secondaryPreviewActionsEventListeners: ['click'],
    secondaryPreviewActionsUid: expect.any(Number),
  })
  expect(result.commands).toEqual([
    ['Viewlet.createFunctionalRoot', 'ExtensionView', result.statePatch.secondaryPreviewActionsUid, true],
    ['Viewlet.registerEventListeners', result.statePatch.secondaryPreviewActionsUid, ['click']],
    ['Viewlet.setDom2', result.statePatch.secondaryPreviewActionsUid, ['voice-actions']],
    ['Viewlet.setUid', result.statePatch.secondaryPreviewActionsUid, 9],
  ])
})

test('setActionsDom updates existing preview actions and event listeners', () => {
  const state = {
    ...ViewletLayout.create(12),
    previewActionsEventListeners: ['old-click'],
    previewActionsUid: 8,
    previewId: 7,
  }

  const result = ViewletLayout.setActionsDom(state, ['updated-actions'], 7, ['new-click'])

  expect(result).toEqual({
    commands: [
      ['Viewlet.registerEventListeners', 8, ['new-click']],
      ['Viewlet.setDom2', 8, ['updated-actions']],
    ],
    handled: true,
    renderParent: false,
    statePatch: {
      previewActionsEventListeners: ['new-click'],
    },
  })
})

const mockActivityBarRender = () => {
  // @ts-ignore
  ActivityBarWorker.invoke.mockImplementation(async (method, ...args) => {
    switch (method) {
      case 'ActivityBar.handleActiveViewStateChange':
      case 'ActivityBar.handleSideBarStateChange':
        return undefined
      case 'ActivityBar.diff2':
        expect(args).toEqual([7])
        return 'diff-1'
      case 'ActivityBar.render2':
        expect(args).toEqual([7, 'diff-1'])
        return [['activity-bar.render2']]
      default:
        throw new Error(`unexpected activity bar method: ${method}`)
    }
  })
}

test('showSideBar shows hidden side bar with requested viewlet', async () => {
  mockActivityBarRender()
  // @ts-ignore
  ViewletManager.load.mockResolvedValue([['Viewlet.createFunctionalRoot', 'SideBar', 1, true]])
  const state = {
    ...ViewletLayout.create(1),
    activityBarId: 7,
    activityBarVisible: true,
    activityBarWidth: 48,
    sideBarView: 'Explorer',
    sideBarVisible: false,
    statusBarHeight: 20,
    titleBarHeight: 0,
    windowHeight: 800,
    windowWidth: 1200,
  }

  const result = await ViewletLayout.showSideBar(state, 'SourceControl')

  expect(ViewletManager.load).toHaveBeenCalledTimes(1)
  expect(ViewletManager.load).toHaveBeenCalledWith(
    expect.objectContaining({
      args: ['SourceControl'],
      id: 'SideBar',
    }),
    false,
    true,
    undefined,
  )
  expect(activityBarInvokeMock.mock.calls).toEqual([
    ['ActivityBar.handleSideBarStateChange', 7, 'SourceControl', true],
    ['ActivityBar.diff2', 7],
    ['ActivityBar.render2', 7, 'diff-1'],
  ])
  expect(result).toEqual({
    commands: [['Viewlet.createFunctionalRoot', 'SideBar', 1, true], ['activity-bar.render2']],
    newState: expect.objectContaining({
      sideBarSashVisible: true,
      sideBarView: 'SourceControl',
      sideBarVisible: true,
    }),
  })
})

test('handleExtensionsChanged switches away from a view contributed by the disabled extension', async () => {
  mockActivityBarRender()
  const state = {
    ...ViewletLayout.create(1),
    activityBarId: 7,
    sideBarId: 12,
    sideBarView: 'sample.views.testing',
    sideBarVisible: true,
  }
  // @ts-ignore
  ViewletStates.getInstance.mockReturnValue({
    state: {
      currentExtensionId: 'sample.extension',
    },
  })

  const result = await ViewletLayout.handleExtensionsChanged(state, 'sample.extension', true)

  expect(result).toEqual({
    commands: [['activity-bar.render2']],
    newState: expect.objectContaining({
      sideBarView: 'Explorer',
      sideBarVisible: true,
    }),
  })
  expect(activityBarInvokeMock.mock.calls).toEqual([
    ['ActivityBar.handleSideBarStateChange', 7, 'Explorer', true],
    ['ActivityBar.diff2', 7],
    ['ActivityBar.render2', 7, 'diff-1'],
  ])
})

test('handleExtensionsChanged preserves the active sidebar view when another extension is disabled', async () => {
  const state = {
    ...ViewletLayout.create(1),
    activityBarId: 7,
    sideBarId: 12,
    sideBarView: 'sample.views.testing',
    sideBarVisible: true,
  }
  // @ts-ignore
  ViewletStates.getInstance.mockReturnValue({
    state: {
      currentExtensionId: 'sample.extension',
    },
  })

  const result = await ViewletLayout.handleExtensionsChanged(state, 'sample.other-extension', true)

  expect(result.newState.sideBarView).toBe('sample.views.testing')
  expect(ActivityBarWorker.invoke).not.toHaveBeenCalled()
})

test('showSideBar disables restore when the layout disables restore', async () => {
  mockActivityBarRender()
  // @ts-ignore
  ViewletManager.load.mockResolvedValue([['Viewlet.createFunctionalRoot', 'SideBar', 1, true]])
  const state = {
    ...ViewletLayout.create(1),
    activityBarId: 7,
    activityBarVisible: true,
    activityBarWidth: 48,
    restore: false,
    sideBarView: 'Explorer',
    sideBarVisible: false,
    statusBarHeight: 20,
    titleBarHeight: 0,
    windowHeight: 800,
    windowWidth: 1200,
  }

  await ViewletLayout.showSideBar(state, 'Explorer')

  expect(viewletManagerLoadMock.mock.calls[0]).toEqual([
    expect.objectContaining({
      args: ['Explorer'],
      id: 'SideBar',
    }),
    false,
    false,
    { restore: false },
  ])
})

test('showSideBar switches visible side bar to requested viewlet', async () => {
  mockActivityBarRender()
  const state = {
    ...ViewletLayout.create(1),
    activityBarId: 7,
    sideBarView: 'Explorer',
    sideBarVisible: true,
  }

  const result = await ViewletLayout.showSideBar(state, 'SourceControl')

  expect(ViewletManager.load).not.toHaveBeenCalled()
  expect(activityBarInvokeMock.mock.calls).toEqual([
    ['ActivityBar.handleSideBarStateChange', 7, 'SourceControl', true],
    ['ActivityBar.diff2', 7],
    ['ActivityBar.render2', 7, 'diff-1'],
  ])
  expect(result).toEqual({
    commands: [['activity-bar.render2']],
    newState: {
      ...state,
      sideBarView: 'SourceControl',
      sideBarVisible: true,
    },
  })
})

test('showSideBar propagates disabled restore when switching a visible side bar', async () => {
  mockActivityBarRender()
  const handleSideBarViewletChange = jest.fn((state: any, _moduleId: string, _restore: boolean) => state)
  const sideBarState = {}
  // @ts-ignore
  ViewletStates.getAllInstances.mockReturnValue({
    12: {
      factory: {
        Commands: {
          handleSideBarViewletChange,
        },
      },
      renderedState: sideBarState,
      state: sideBarState,
    },
  })
  const state = {
    ...ViewletLayout.create(1),
    activityBarId: 7,
    restore: false,
    sideBarView: 'Explorer',
    sideBarVisible: true,
  }

  await ViewletLayout.showSideBar(state, 'SourceControl')

  expect(handleSideBarViewletChange.mock.calls[0]).toEqual([sideBarState, 'SourceControl', false])
})

test('hideSideBar updates activity bar through shared sidebar render helper', async () => {
  mockActivityBarRender()
  const state = {
    ...ViewletLayout.create(1),
    activityBarId: 7,
    sideBarId: 12,
    sideBarView: 'Explorer',
    sideBarVisible: true,
  }

  const result = await ViewletLayout.hideSideBar(state)

  expect(activityBarInvokeMock.mock.calls).toEqual([
    ['ActivityBar.handleSideBarStateChange', 7, 'Explorer', false],
    ['ActivityBar.diff2', 7],
    ['ActivityBar.render2', 7, 'diff-1'],
  ])
  expect(result).toEqual({
    commands: [['activity-bar.render2']],
    newState: expect.objectContaining({
      sideBarSashVisible: false,
      sideBarView: 'Explorer',
      sideBarVisible: false,
    }),
  })
})

test('loadSideBarIfVisible disables child restore when layout restore is disabled', async () => {
  // @ts-ignore
  ViewletManager.load.mockResolvedValue([['Viewlet.createFunctionalRoot', 'SideBar', 1, true]])
  const state = {
    ...ViewletLayout.create(1),
    restore: false,
    sideBarHeight: 400,
    sideBarLeft: 0,
    sideBarTop: 0,
    sideBarVisible: true,
    sideBarWidth: 300,
  }

  await ViewletLayout.loadSideBarIfVisible(state)

  expect(viewletManagerLoadMock.mock.calls[0]).toEqual([
    expect.objectContaining({
      id: 'SideBar',
    }),
    false,
    false,
    { restore: false },
  ])
})

test('createPanelViewlet creates a linked actions root for child-contributed actions', async () => {
  const state = ViewletLayout.create(1)
  const events = [{ name: 'handleClickAction', params: ['run'] }]
  const actionsDom = [{ type: 'Button', childCount: 0 }]
  // @ts-ignore
  ViewletManager.load.mockImplementation(async (viewlet) => [
    ['Viewlet.create', 'Output', 11],
    ...(viewlet.shouldRenderEvents === false ? [['Viewlet.registerEventListeners', 11, events]] : []),
    ['Viewlet.send', -1, 'setActionsDom', actionsDom, 11],
  ])

  const result = await ViewletLayout.createPanelViewlet(
    state,
    'Output',
    11,
    22,
    33,
    {
      x: 0,
      y: 35,
      width: 400,
      height: 200,
    },
    '',
  )

  expect(ViewletManager.load).toHaveBeenCalledTimes(1)
  expect(ViewletManager.load).toHaveBeenCalledWith(
    expect.objectContaining({
      actionsUid: 33,
    }),
    false,
    true,
  )
  expect(result).toEqual({
    newState: state,
    commands: [
      ['Viewlet.create', 'Output', 11],
      ['Viewlet.registerEventListeners', 11, events],
      ['Viewlet.createFunctionalRoot', 'Output', 33, true],
      ['Viewlet.registerEventListeners', 33, events],
      ['Viewlet.setDom2', 33, actionsDom],
      ['Viewlet.setUid', 33, 11],
    ],
  })
})

test('createPanelViewlet omits empty event listener registration for its new actions root', async () => {
  const state = ViewletLayout.create(1)
  const actionsDom = [{ type: 'Button', childCount: 0 }]
  // @ts-ignore
  ViewletManager.load.mockResolvedValue([
    ['Viewlet.create', 'Output', 11],
    ['Viewlet.send', -1, 'setActionsDom', actionsDom, 11],
  ])

  const result = await ViewletLayout.createPanelViewlet(
    state,
    'Output',
    11,
    22,
    33,
    {
      x: 0,
      y: 35,
      width: 400,
      height: 200,
    },
    '',
  )

  expect(result.commands).toEqual([
    ['Viewlet.create', 'Output', 11],
    ['Viewlet.createFunctionalRoot', 'Output', 33, true],
    ['Viewlet.setDom2', 33, actionsDom],
    ['Viewlet.setUid', 33, 11],
  ])
})

test('createPanelViewlet renders initial actions after creating their root', async () => {
  const state = ViewletLayout.create(1)
  const actionsDom = [{ type: 'Button', childCount: 0 }]
  // @ts-ignore
  ViewletManager.load.mockResolvedValue([
    ['Viewlet.create', 'Terminals', 11],
    ['Viewlet.setDom2', 33, actionsDom],
  ])

  const result = await ViewletLayout.createPanelViewlet(
    state,
    'Terminals',
    11,
    22,
    33,
    {
      x: 0,
      y: 35,
      width: 400,
      height: 200,
    },
    '',
  )

  expect(result.commands).toEqual([
    ['Viewlet.create', 'Terminals', 11],
    ['Viewlet.createFunctionalRoot', 'Terminals', 33, true],
    ['Viewlet.setDom2', 33, actionsDom],
    ['Viewlet.setUid', 33, 11],
  ])
})

test('createPanelViewlet renders an empty actions root when the panel view has no actions', async () => {
  const state = ViewletLayout.create(1)
  // @ts-ignore
  ViewletManager.load.mockResolvedValue([['Viewlet.create', 'Problems', 11]])

  const result = await ViewletLayout.createPanelViewlet(
    state,
    'Problems',
    11,
    22,
    33,
    {
      x: 0,
      y: 35,
      width: 400,
      height: 200,
    },
    '',
  )

  expect(result.commands).toEqual([
    ['Viewlet.create', 'Problems', 11],
    ['Viewlet.createFunctionalRoot', 'Problems', 33, true],
    [
      'Viewlet.setDom2',
      33,
      [
        {
          childCount: 0,
          className: 'Actions',
          role: 'toolbar',
          type: 4,
        },
      ],
    ],
    ['Viewlet.setUid', 33, 11],
  ])
})

test('createPanelViewlet forwards focus to the loaded panel view', async () => {
  const state = ViewletLayout.create(1)
  // @ts-ignore
  ViewletManager.load.mockResolvedValue([])

  await ViewletLayout.createPanelViewlet(
    state,
    'Terminals',
    11,
    22,
    33,
    {
      x: 0,
      y: 35,
      width: 400,
      height: 200,
    },
    '',
    true,
  )

  expect(ViewletManager.load).toHaveBeenCalledWith(
    expect.objectContaining({
      focus: true,
      id: 'Terminals',
      uid: 11,
    }),
    true,
    true,
  )
})

test('toggleSideBarView hides the current side bar view when the same item is clicked', async () => {
  mockActivityBarRender()
  const state = {
    ...ViewletLayout.create(1),
    activityBarId: 7,
    sideBarId: 12,
    sideBarView: 'Explorer',
    sideBarVisible: true,
  }

  const result = await ViewletLayout.toggleSideBarView(state, 'Explorer')

  expect(activityBarInvokeMock.mock.calls).toEqual([
    ['ActivityBar.handleSideBarStateChange', 7, 'Explorer', false],
    ['ActivityBar.diff2', 7],
    ['ActivityBar.render2', 7, 'diff-1'],
  ])
  expect(result).toEqual({
    commands: [['activity-bar.render2']],
    newState: expect.objectContaining({
      sideBarView: 'Explorer',
      sideBarVisible: false,
    }),
  })
})

test('toggleSideBarView preserves resized preview width when showing the side bar', async () => {
  mockActivityBarRender()
  // @ts-ignore
  ViewletManager.load.mockResolvedValue([['Viewlet.createFunctionalRoot', 'SideBar', 1, true]])
  const state = {
    ...ViewletLayout.create(1),
    activityBarId: 7,
    activityBarVisible: true,
    activityBarWidth: 48,
    previewMinWidth: 100,
    previewVisible: true,
    previewWidth: 320,
    sideBarMaxWidth: 9999999,
    sideBarMinWidth: 170,
    sideBarView: 'Explorer',
    sideBarVisible: false,
    sideBarWidth: 240,
    statusBarHeight: 20,
    titleBarHeight: 0,
    windowHeight: 800,
    windowWidth: 1200,
  }

  const result = await ViewletLayout.toggleSideBarView(state, 'SourceControl')

  expect(result.newState).toMatchObject({
    previewLeft: 880,
    previewWidth: 320,
    sideBarView: 'SourceControl',
    sideBarVisible: true,
  })
})

test('toggleSideBarView appends focus commands after showing the requested view', async () => {
  mockActivityBarRender()
  // @ts-ignore
  Viewlet.getFocusCommands.mockResolvedValue([['Viewlet.focusElementByName', 12, 'SearchValue']])
  const state = {
    ...ViewletLayout.create(1),
    activityBarId: 7,
    sideBarView: 'Explorer',
    sideBarVisible: true,
  }

  const result = await ViewletLayout.toggleSideBarView(state, 'Search')

  expect(Viewlet.getFocusCommands).toHaveBeenCalledWith('Search')
  expect(result.commands).toEqual([['activity-bar.render2'], ['Viewlet.focusElementByName', 12, 'SearchValue']])
})

test('openSideBarView waits for deferred content and focuses the mounted view when requested', async () => {
  mockActivityBarRender()
  const state = {
    ...ViewletLayout.create(1),
    activityBarId: 7,
    sideBarView: 'Explorer',
    sideBarVisible: true,
  }

  const result = await ViewletLayout.openSideBarView(state, 'Extensions', true, undefined)

  expect(ViewletManager.waitForLoadContentLater).toHaveBeenCalledWith('Extensions')
  expect(Viewlet.focus).toHaveBeenCalledWith('Extensions')
  expect(result.commands).toEqual([['activity-bar.render2']])
})

test('openSideBarView does not request focus by default', async () => {
  mockActivityBarRender()
  const state = {
    ...ViewletLayout.create(1),
    activityBarId: 7,
    sideBarView: 'Explorer',
    sideBarVisible: true,
  }

  await ViewletLayout.openSideBarView(state, 'Extensions', false, undefined)

  expect(ViewletManager.waitForLoadContentLater).not.toHaveBeenCalled()
  expect(Viewlet.focus).not.toHaveBeenCalled()
})

test('openChat focuses an already open chat when requested', async () => {
  const state = {
    ...ViewletLayout.create(1),
    secondarySideBarView: 'Chat',
    secondarySideBarVisible: true,
  }

  const result = await ViewletLayout.openChat(state, true)

  expect(ViewletManager.waitForLoadContentLater).toHaveBeenCalledWith('Chat')
  expect(Viewlet.focus).toHaveBeenCalledWith('Chat')
  expect(result).toEqual({
    newState: state,
    commands: [],
  })
})

test('openChat focuses chat after opening the secondary side bar', async () => {
  // @ts-ignore
  ViewletManager.load.mockResolvedValue([])
  const state = {
    ...ViewletLayout.create(1),
    secondarySideBarView: '',
    secondarySideBarVisible: false,
  }

  const result = await ViewletLayout.openChat(state, true)

  expect(ViewletManager.waitForLoadContentLater).toHaveBeenCalledWith('Chat')
  expect(Viewlet.focus).toHaveBeenCalledWith('Chat')
  expect(result.newState).toMatchObject({
    secondarySideBarView: 'Chat',
    secondarySideBarVisible: true,
  })
  expect(result.commands).toEqual([])
})

test('showSecondarySideBar preserves left side bar layout and resized preview width', async () => {
  // @ts-ignore
  ViewletManager.load.mockResolvedValue([])
  const state = LayoutPoints.getPoints(
    {
      ...ViewletLayout.create(1),
      activityBarVisible: true,
      activityBarWidth: 48,
      previewMinWidth: 100,
      previewVisible: true,
      previewWidth: 400,
      secondarySideBarMaxWidth: 9999999,
      secondarySideBarMinWidth: 220,
      secondarySideBarVisible: false,
      secondarySideBarWidth: 300,
      sideBarLocation: SideBarLocationType.Left,
      sideBarMaxWidth: 9999999,
      sideBarMinWidth: 170,
      sideBarVisible: true,
      sideBarWidth: 240,
      statusBarHeight: 20,
      titleBarHeight: 0,
      windowHeight: 1080,
      windowWidth: 1920,
    },
    SideBarLocationType.Left,
  )

  const result = await ViewletLayout.showSecondarySideBar(state)

  expect(result.newState).toMatchObject({
    activityBarLeft: 0,
    mainLeft: 288,
    mainWidth: 1012,
    previewLeft: 1520,
    previewWidth: 400,
    secondarySideBarLeft: 1300,
    secondarySideBarWidth: 220,
    sideBarLeft: 48,
    sideBarLocation: SideBarLocationType.Left,
  })
})

test('openChat leaves an already open chat unfocused by default', async () => {
  const state = {
    ...ViewletLayout.create(1),
    secondarySideBarView: 'Chat',
    secondarySideBarVisible: true,
  }

  const result = await ViewletLayout.openChat(state)

  expect(ViewletManager.waitForLoadContentLater).not.toHaveBeenCalled()
  expect(Viewlet.focus).not.toHaveBeenCalled()
  expect(result).toEqual({ newState: state, commands: [] })
})

test('toggleSideBarView opens a preview-preferred extension view alongside the sidebar', async () => {
  mockActivityBarRender()
  // @ts-ignore
  GetExtensionViews.getExtensionView.mockResolvedValue({
    id: 'sample.views.preview',
    preferredLocation: 'preview',
  })
  // @ts-ignore
  ViewletManager.load.mockResolvedValue([['Viewlet.createFunctionalRoot', 'ExtensionView', 1, true]])
  const state = {
    ...ViewletLayout.create(1),
    activityBarId: 7,
    activityBarVisible: true,
    activityBarWidth: 48,
    sideBarId: 12,
    sideBarMaxWidth: 1200,
    sideBarMinWidth: 170,
    sideBarSashVisible: true,
    sideBarView: 'Explorer',
    sideBarVisible: true,
    sideBarWidth: 240,
    statusBarHeight: 20,
    titleBarHeight: 0,
    windowHeight: 800,
    windowWidth: 1200,
    previewMinWidth: 100,
    previewWidth: 320,
  }

  const result = await ViewletLayout.toggleSideBarView(state, 'sample.views.preview')

  expect(result.newState).toMatchObject({
    mainWidth: 312,
    previewLeft: 600,
    previewUri: 'sample.views.preview',
    previewViewletId: 'ExtensionView',
    previewVisible: true,
    previewWidth: 600,
    sideBarSashVisible: true,
    sideBarVisible: true,
  })
  expect(ViewletManager.load).toHaveBeenCalledWith(
    expect.objectContaining({
      id: 'ExtensionView',
      uri: 'sample.views.preview',
      width: 600,
      x: 600,
    }),
    false,
    true,
    undefined,
  )
  expect(activityBarInvokeMock.mock.calls).toEqual([
    ['ActivityBar.handleActiveViewStateChange', 7, 'sample.views.preview', true],
    ['ActivityBar.diff2', 7],
    ['ActivityBar.render2', 7, 'diff-1'],
  ])
})

test('toggleSideBarView opens a secondary-preview view without replacing the primary preview', async () => {
  mockActivityBarRender()
  // @ts-ignore
  GetExtensionViews.getExtensionView.mockResolvedValue({
    id: 'gpt-voice.views.default',
    preferredLocation: 'secondaryPreview',
  })
  // @ts-ignore
  ViewletManager.load.mockResolvedValue([['Viewlet.createFunctionalRoot', 'ExtensionView', 1, true]])
  const state = {
    ...ViewletLayout.create(1),
    activityBarId: 7,
    activityBarVisible: true,
    activityBarWidth: 48,
    previewId: 11,
    previewMinWidth: 100,
    previewUri: 'simple-browser://',
    previewViewletId: 'SimpleBrowser',
    previewVisible: true,
    previewWidth: 600,
    secondaryPreviewMinWidth: 100,
    sideBarId: 12,
    sideBarMaxWidth: 1200,
    sideBarMinWidth: 170,
    sideBarView: 'Explorer',
    sideBarVisible: true,
    sideBarWidth: 240,
    statusBarHeight: 20,
    windowHeight: 800,
    windowWidth: 1200,
  }

  const result = await ViewletLayout.toggleSideBarView(state, 'gpt-voice.views.default')

  expect(result.newState).toMatchObject({
    previewId: 11,
    previewLeft: 400,
    previewUri: 'simple-browser://',
    previewVisible: true,
    previewWidth: 400,
    secondaryPreviewLeft: 800,
    secondaryPreviewUri: 'gpt-voice.views.default',
    secondaryPreviewVisible: true,
    secondaryPreviewWidth: 400,
  })
  expect(Viewlet.disposeFunctional).not.toHaveBeenCalledWith(11)
  expect(activityBarInvokeMock.mock.calls).toEqual([
    ['ActivityBar.handleActiveViewStateChange', 7, 'gpt-voice.views.default', true],
    ['ActivityBar.diff2', 7],
    ['ActivityBar.render2', 7, 'diff-1'],
  ])
})

test('toggleSideBarView hides the preview when its selected activity item is clicked again', async () => {
  mockActivityBarRender()
  // @ts-ignore
  GetExtensionViews.getExtensionView.mockResolvedValue({
    id: 'sample.views.preview',
    preferredLocation: 'preview',
  })
  const state = {
    ...ViewletLayout.create(1),
    activityBarId: 7,
    previewId: 11,
    previewUri: 'sample.views.preview',
    previewViewletId: 'ExtensionView',
    previewVisible: true,
  }

  const result = await ViewletLayout.toggleSideBarView(state, 'sample.views.preview')

  expect(result.newState).toMatchObject({
    previewId: -1,
    previewVisible: false,
  })
  expect(SaveState.saveViewletStateWithStorageId).toHaveBeenCalledWith(11, 'ExtensionView')
  expect(Viewlet.disposeFunctional).toHaveBeenCalledWith(11)
  expect(activityBarInvokeMock.mock.calls).toEqual([
    ['ActivityBar.handleActiveViewStateChange', 7, 'sample.views.preview', false],
    ['ActivityBar.diff2', 7],
    ['ActivityBar.render2', 7, 'diff-1'],
  ])
})

test('toggleSideBarView preserves resized preview width after hiding and reopening', async () => {
  mockActivityBarRender()
  // @ts-ignore
  GetExtensionViews.getExtensionView.mockResolvedValue({
    id: 'sample.views.preview',
    preferredLocation: 'preview',
  })
  // @ts-ignore
  ViewletManager.load.mockResolvedValue([])
  const state = LayoutPoints.getPoints({
    ...ViewletLayout.create(1),
    activityBarId: 7,
    activityBarVisible: true,
    activityBarWidth: 48,
    previewId: 11,
    previewMinWidth: 100,
    previewUri: 'sample.views.preview',
    previewViewletId: 'ExtensionView',
    previewVisible: true,
    previewWidth: 400,
    sideBarMaxWidth: 1200,
    sideBarMinWidth: 170,
    sideBarVisible: true,
    sideBarWidth: 240,
    statusBarHeight: 20,
    windowHeight: 800,
    windowWidth: 1200,
  })

  const hidden = await ViewletLayout.toggleSideBarView(state, 'sample.views.preview')
  const reopened = await ViewletLayout.toggleSideBarView(hidden.newState, 'sample.views.preview')

  expect(reopened.newState).toMatchObject({
    previewLeft: 800,
    previewUri: 'sample.views.preview',
    previewVisible: true,
    previewWidth: 400,
  })
})

test('showPreview updates both activity items when replacing a preview extension view', async () => {
  mockActivityBarRender()
  // @ts-ignore
  ViewletManager.load.mockResolvedValue([['Viewlet.createFunctionalRoot', 'ExtensionView', 1, true]])
  const state = {
    ...ViewletLayout.create(1),
    activityBarId: 7,
    previewId: 11,
    previewUri: 'sample.views.first',
    previewViewletId: 'ExtensionView',
    previewVisible: true,
  }

  const result = await ViewletLayout.showPreview(state, 'sample.views.second', 'ExtensionView')

  expect(result.newState).toMatchObject({
    previewUri: 'sample.views.second',
    previewViewletId: 'ExtensionView',
    previewVisible: true,
  })
  expect(activityBarInvokeMock.mock.calls).toEqual([
    ['ActivityBar.handleActiveViewStateChange', 7, 'sample.views.first', false],
    ['ActivityBar.handleActiveViewStateChange', 7, 'sample.views.second', true],
    ['ActivityBar.diff2', 7],
    ['ActivityBar.render2', 7, 'diff-1'],
  ])
})

test('showPreview deactivates a preview extension item when a file preview replaces it', async () => {
  mockActivityBarRender()
  // @ts-ignore
  ViewletManager.load.mockResolvedValue([['Viewlet.createFunctionalRoot', 'Preview', 1, true]])
  const state = {
    ...ViewletLayout.create(1),
    activityBarId: 7,
    previewId: 11,
    previewUri: 'sample.views.preview',
    previewViewletId: 'ExtensionView',
    previewVisible: true,
  }

  const result = await ViewletLayout.showPreview(state, 'file:///readme.md')

  expect(result.newState).toMatchObject({
    previewUri: 'file:///readme.md',
    previewViewletId: 'Preview',
    previewVisible: true,
  })
  expect(activityBarInvokeMock.mock.calls).toEqual([
    ['ActivityBar.handleActiveViewStateChange', 7, 'sample.views.preview', false],
    ['ActivityBar.diff2', 7],
    ['ActivityBar.render2', 7, 'diff-1'],
  ])
})

test.each([
  ['opening Explorer', false, 'Explorer'],
  ['switching from Explorer to Search', true, 'Search'],
])('toggleSideBarView keeps a preview-preferred extension view open while %s', async (_label, sideBarVisible, sideBarView) => {
  mockActivityBarRender()
  // @ts-ignore
  GetExtensionViews.getExtensionView.mockImplementation(async (id) => {
    return id === 'sample.views.preview'
      ? {
          id,
          preferredLocation: 'preview',
        }
      : undefined
  })
  // @ts-ignore
  ViewletManager.load.mockResolvedValue([['Viewlet.createFunctionalRoot', 'SideBar', 1, true]])
  const state = {
    ...ViewletLayout.create(1),
    activityBarId: 7,
    activityBarVisible: true,
    activityBarWidth: 48,
    previewId: 11,
    previewUri: 'sample.views.preview',
    previewViewletId: 'ExtensionView',
    previewVisible: true,
    sideBarView: 'Explorer',
    sideBarVisible,
    statusBarHeight: 20,
    titleBarHeight: 0,
    windowHeight: 800,
    windowWidth: 1200,
  }

  const result = await ViewletLayout.toggleSideBarView(state, sideBarView)

  expect(result.newState).toMatchObject({
    previewVisible: true,
    sideBarView,
    sideBarVisible: true,
  })
  expect(SaveState.saveViewletStateWithStorageId).not.toHaveBeenCalled()
  expect(Viewlet.disposeFunctional).not.toHaveBeenCalledWith(11)
  expect(activityBarInvokeMock.mock.calls).toEqual([
    ['ActivityBar.handleSideBarStateChange', 7, sideBarView, true],
    ['ActivityBar.diff2', 7],
    ['ActivityBar.render2', 7, 'diff-1'],
  ])
  if (!sideBarVisible) {
    expect(ViewletManager.load).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'SideBar',
      }),
      false,
      true,
      undefined,
    )
  }
})

test('layout allows the side bar to grow when the preview uses half the window', () => {
  const state = LayoutPoints.getPoints({
    ...ViewletLayout.create(1),
    activityBarVisible: true,
    activityBarWidth: 48,
    previewMinWidth: 100,
    previewVisible: true,
    previewWidth: 900,
    sideBarMaxWidth: 9_999_999,
    sideBarMinWidth: 170,
    sideBarVisible: true,
    sideBarWidth: 700,
    windowHeight: 800,
    windowWidth: 1800,
  })

  expect(state).toMatchObject({
    mainWidth: 152,
    previewWidth: 900,
    sideBarWidth: 700,
  })
})

test('resizing the side bar preserves a 100px main area', async () => {
  const state = {
    ...ViewletLayout.create(1),
    activityBarVisible: true,
    activityBarWidth: 48,
    previewMinWidth: 100,
    previewVisible: true,
    previewWidth: 600,
    sashId: 'SideBar',
    sideBarMaxWidth: 9_999_999,
    sideBarMinWidth: 170,
    sideBarVisible: true,
    sideBarWidth: 240,
    windowHeight: 800,
    windowWidth: 1200,
  }

  const result = await ViewletLayout.handleSashPointerMove(state, 0, 400)

  expect(result.newState).toMatchObject({
    mainWidth: 100,
    previewWidth: 600,
    sideBarWidth: 452,
  })
})

test('double clicking the side bar sash resets the side bar width', async () => {
  const state = {
    ...ViewletLayout.create(1),
    activityBarVisible: true,
    activityBarWidth: 48,
    sideBarMaxWidth: 9_999_999,
    sideBarMinWidth: 170,
    sideBarVisible: true,
    sideBarWidth: 400,
    windowHeight: 800,
    windowWidth: 1200,
  }

  const result = await ViewletLayout.handleSashDoubleClick(state, 'SideBar')

  expect(result.newState).toMatchObject({
    mainWidth: 912,
    sideBarWidth: 240,
  })
})
