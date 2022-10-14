import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/RendererProcess/RendererProcess.js',
  () => {
    return {
      invoke: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)
jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => {
  return {
    dispose: jest.fn(() => {
      throw new Error('not implemented')
    }),
    resize: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)

const Layout = await import('../src/parts/Layout/Layout.js')

test('getPoints - default layout', () => {
  expect(
    Layout.getPoints(
      {
        sideBarVisible: true,
        sideBarWidth: 240,
        sideBarPosition: 'left',
        activityBarVisible: true,
        panelVisible: false,
        panelHeight: 160,
        titleBarVisible: true,
        statusBarVisible: true,
      },
      { windowWidth: 826, windowHeight: 636, titleBarHeight: 0 }
    )
  ).toEqual({
    activityBarHeight: 596,
    activityBarLeft: 778,
    activityBarTop: 20,
    activityBarVisible: true,
    activityBarWidth: 48,
    mainHeight: 596,
    mainLeft: 0,
    mainTop: 20,
    mainVisible: true,
    mainWidth: 538,
    panelHeight: 0,
    panelLeft: 0,
    panelTop: 616,
    panelVisible: false,
    panelWidth: 778,
    sideBarHeight: 596,
    sideBarLeft: 538,
    sideBarTop: 20,
    sideBarVisible: true,
    sideBarWidth: 240,
    statusBarHeight: 20,
    statusBarLeft: 0,
    statusBarTop: 616,
    statusBarVisible: true,
    statusBarWidth: 826,
    titleBarHeight: 20,
    titleBarLeft: 0,
    titleBarTop: 0,
    titleBarVisible: true,
    titleBarWidth: 826,
    windowHeight: 636,
    windowWidth: 826,
  })
})

test('getPoints - side bar width to narrow', () => {
  expect(
    Layout.getPoints(
      {
        sideBarVisible: true,
        sideBarWidth: 0,
        sideBarPosition: 'left',
        activityBarVisible: true,
        panelVisible: false,
        panelHeight: 160,
        titleBarVisible: true,
        statusBarVisible: true,
      },
      { windowWidth: 826, windowHeight: 636, titleBarHeight: 0 }
    )
  ).toEqual({
    activityBarHeight: 596,
    activityBarLeft: 778,
    activityBarTop: 20,
    activityBarVisible: true,
    activityBarWidth: 48,
    mainHeight: 596,
    mainLeft: 0,
    mainTop: 20,
    mainVisible: true,
    mainWidth: 608,
    panelHeight: 0,
    panelLeft: 0,
    panelTop: 616,
    panelVisible: false,
    panelWidth: 778,
    sideBarHeight: 596,
    sideBarLeft: 608,
    sideBarTop: 20,
    sideBarVisible: true,
    sideBarWidth: 170,
    statusBarHeight: 20,
    statusBarLeft: 0,
    statusBarTop: 616,
    statusBarVisible: true,
    statusBarWidth: 826,
    titleBarHeight: 20,
    titleBarLeft: 0,
    titleBarTop: 0,
    titleBarVisible: true,
    titleBarWidth: 826,
    windowHeight: 636,
    windowWidth: 826,
  })
})

test('getPoints - panel height to narrow', () => {
  expect(
    Layout.getPoints(
      {
        sideBarVisible: true,
        sideBarWidth: 240,
        sideBarPosition: 'left',
        activityBarVisible: true,
        panelVisible: true,
        panelHeight: 0,
        titleBarVisible: true,
        statusBarVisible: true,
      },
      {
        windowWidth: 826,
        windowHeight: 636,
        titleBarHeight: 0,
      }
    )
  ).toEqual({
    activityBarHeight: 596,
    activityBarLeft: 778,
    activityBarTop: 20,
    activityBarVisible: true,
    activityBarWidth: 48,
    mainHeight: 446,
    mainLeft: 0,
    mainTop: 20,
    mainVisible: true,
    mainWidth: 538,
    panelHeight: 150,
    panelLeft: 0,
    panelTop: 466,
    panelVisible: true,
    panelWidth: 778,
    sideBarHeight: 446,
    sideBarLeft: 538,
    sideBarTop: 20,
    sideBarVisible: true,
    sideBarWidth: 240,
    statusBarHeight: 20,
    statusBarLeft: 0,
    statusBarTop: 616,
    statusBarVisible: true,
    statusBarWidth: 826,
    titleBarHeight: 20,
    titleBarLeft: 0,
    titleBarTop: 0,
    titleBarVisible: true,
    titleBarWidth: 826,
    windowHeight: 636,
    windowWidth: 826,
  })
})

test('getPoints - titleBar hidden', () => {
  expect(
    Layout.getPoints(
      {
        sideBarVisible: true,
        sideBarWidth: 240,
        sideBarPosition: 'left',
        activityBarVisible: true,
        panelVisible: false,
        panelHeight: 160,
        titleBarVisible: false,
        statusBarVisible: true,
      },
      { windowWidth: 826, windowHeight: 636, titleBarHeight: 0 }
    )
  ).toEqual({
    activityBarHeight: 616,
    activityBarLeft: 778,
    activityBarTop: 0,
    activityBarVisible: true,
    activityBarWidth: 48,
    mainHeight: 616,
    mainLeft: 0,
    mainTop: 0,
    mainVisible: true,
    mainWidth: 538,
    panelHeight: 0,
    panelLeft: 0,
    panelTop: 616,
    panelVisible: false,
    panelWidth: 778,
    sideBarHeight: 616,
    sideBarLeft: 538,
    sideBarTop: 0,
    sideBarVisible: true,
    sideBarWidth: 240,
    statusBarHeight: 20,
    statusBarLeft: 0,
    statusBarTop: 616,
    statusBarVisible: true,
    statusBarWidth: 826,
    titleBarHeight: 20,
    titleBarLeft: 0,
    titleBarTop: 0,
    titleBarVisible: true,
    titleBarWidth: 826,
    windowHeight: 636,
    windowWidth: 826,
  })
})

test('getPoints - sideBar hidden', () => {
  expect(
    Layout.getPoints(
      {
        sideBarVisible: false,
        sideBarWidth: 240,
        sideBarPosition: 'left',
        activityBarVisible: true,
        panelVisible: false,
        panelHeight: 160,
        titleBarVisible: true,
        statusBarVisible: true,
      },
      {
        windowWidth: 826,
        windowHeight: 636,
        titleBarHeight: 0,
      }
    )
  ).toEqual({
    activityBarHeight: 596,
    activityBarLeft: 778,
    activityBarTop: 20,
    activityBarVisible: true,
    activityBarWidth: 48,
    mainHeight: 596,
    mainLeft: 0,
    mainTop: 20,
    mainVisible: true,
    mainWidth: 778,
    panelHeight: 0,
    panelLeft: 0,
    panelTop: 616,
    panelVisible: false,
    panelWidth: 778,
    sideBarHeight: 596,
    sideBarLeft: 778,
    sideBarTop: 20,
    sideBarVisible: false,
    sideBarWidth: 0,
    statusBarHeight: 20,
    statusBarLeft: 0,
    statusBarTop: 616,
    statusBarVisible: true,
    statusBarWidth: 826,
    titleBarHeight: 20,
    titleBarLeft: 0,
    titleBarTop: 0,
    titleBarVisible: true,
    titleBarWidth: 826,
    windowWidth: 826,
    windowHeight: 636,
  })
})

// TODO test resize

// TODO test hydrate

test.skip('updateLayout', () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  Layout.updateLayout(Layout.state)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith([
    'Layout.update',
    {
      'ActivityBar.visible': true,
      'Panel.height': 160,
      'Panel.visible': false,
      'SideBar.position': 'left',
      'SideBar.visible': true,
      'SideBar.width': 240,
      'StatusBar.visible': true,
      'TitleBar.visible': true,
    },
  ])
})

test('showSideBar', () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  Layout.state.sideBarVisible = false
  Layout.showSideBar()
  expect(Layout.state.sideBarVisible).toBe(true)
})

test('hideSideBar', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  Layout.state.sideBarVisible = true
  await Layout.hideSideBar()
  expect(Layout.state.sideBarVisible).toBe(false)
})

test.skip('toggleSideBar - on', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  Layout.state.sideBarVisible = false
  await Layout.toggleSideBar()
  expect(Layout.state.sideBarVisible).toBe(true)
})

test('showPanel', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})

  Layout.state.panelVisible = false
  await Layout.showPanel()
  expect(Layout.state.panelVisible).toBe(true)
})

test('hidePanel', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  Layout.state.panelVisible = true
  await Layout.hidePanel()
  expect(Layout.state.panelVisible).toBe(false)
})

test('togglePanel - on', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  Layout.state.panelVisible = false
  await Layout.togglePanel()
  expect(Layout.state.panelVisible).toBe(true)
})

test('showActivityBar', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  Layout.state.activityBarVisible = false
  await Layout.showActivityBar()
  expect(Layout.state.activityBarVisible).toBe(true)
})

test('hideActivityBar', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  Layout.state.activityBarVisible = true
  await Layout.hideActivityBar()
  expect(Layout.state.activityBarVisible).toBe(false)
})

test('toggleActivityBar - on', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  Layout.state.activityBarVisible = false
  await Layout.toggleActivityBar()
  expect(Layout.state.activityBarVisible).toBe(true)
})

test.skip('handleResize', async () => {
  expect.any(Number),
    await Layout.handleResize({
      windowWidth: 1852,
      windowHeight: 500,
      titleBarHeight: 0,
    })
  expect(Layout.state.windowHeight).toBe(500)
  expect(Layout.state.windowWidth).toBe(1852)
})
