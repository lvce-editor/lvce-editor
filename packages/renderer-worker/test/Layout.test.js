import { jest } from '@jest/globals'
import * as Layout from '../src/parts/Layout/Layout.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'

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
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  Layout.updateLayout(Layout.state)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    1100,
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
  // TODO this can be replaced with jest.spyOn(RendererProcess) once jest supports it
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  Layout.state.sideBarVisible = false
  Layout.showSideBar()
  expect(Layout.state.sideBarVisible).toBe(true)
})

test('hideSideBar', async () => {
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  Layout.state.sideBarVisible = true
  await Layout.hideSideBar()
  expect(Layout.state.sideBarVisible).toBe(false)
})

test.skip('toggleSideBar - on', async () => {
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  Layout.state.sideBarVisible = false
  await Layout.toggleSideBar()
  expect(Layout.state.sideBarVisible).toBe(true)
})

test('showPanel', async () => {
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  Layout.state.panelVisible = false
  await Layout.showPanel()
  expect(Layout.state.panelVisible).toBe(true)
})

test('hidePanel', async () => {
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  Layout.state.panelVisible = true
  await Layout.hidePanel()
  expect(Layout.state.panelVisible).toBe(false)
})

test('togglePanel - on', async () => {
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  Layout.state.panelVisible = false
  await Layout.togglePanel()
  expect(Layout.state.panelVisible).toBe(true)
})

test('showActivityBar', async () => {
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  Layout.state.activityBarVisible = false
  await Layout.showActivityBar()
  expect(Layout.state.activityBarVisible).toBe(true)
})

test('hideActivityBar', async () => {
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  Layout.state.activityBarVisible = true
  await Layout.hideActivityBar()
  expect(Layout.state.activityBarVisible).toBe(false)
})

test('toggleActivityBar - on', async () => {
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  Layout.state.activityBarVisible = false
  await Layout.toggleActivityBar()
  expect(Layout.state.activityBarVisible).toBe(true)
})

test('handleResize', async () => {
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      case 3024:
        break
      default:
        console.log({ message })
        throw new Error('unexpected message')
    }
  })
  await Layout.handleResize({
    windowWidth: 1852,
    windowHeight: 500,
    titleBarHeight: 0,
  })
  expect(Layout.state.windowHeight).toBe(500)
  expect(Layout.state.windowWidth).toBe(1852)
})

test('handleSashSideBarMove', async () => {
  // TODO would be better to create instances of layout so that tests can run independently
  // probably make Layout a functional viewlet like ViewletExtensions
  Layout.state.mainWidth = 992
  Layout.state.sideBarLeft = 992
  Layout.state.sideBarVisible = true
  Layout.state.sideBarWidth = 240
  Layout.state.windowWidth = 1280
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      case 3024:
        break
      default:
        console.log({ message })
        throw new Error('unexpected message')
    }
  })
  await Layout.handleSashPointerDown('SideBar')
  await Layout.handleSashPointerMove(892, 892)
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(2)
  expect(RendererProcess.state.send).toHaveBeenNthCalledWith(1, [
    909090,
    35,
    1100,
    expect.objectContaining({
      mainWidth: 892,
      sideBarLeft: 892,
      sideBarWidth: 340,
    }),
  ])
})

test('handleSashSideBarMove - side bar should stay at min width when dragging makes width a bit smaller than min width', async () => {
  Layout.state.mainWidth = 992
  Layout.state.sideBarLeft = 992
  Layout.state.sideBarVisible = true
  Layout.state.sideBarWidth = 240
  Layout.state.windowWidth = 1280
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      case 3024:
        break
      default:
        console.log({ message })
        throw new Error('unexpected message')
    }
  })
  await Layout.handleSashPointerDown('SideBar')
  await Layout.handleSashPointerMove(1092, 1092)
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(2)
  expect(RendererProcess.state.send).toHaveBeenNthCalledWith(1, [
    909090,
    expect.any(Number),
    1100,
    expect.objectContaining({
      mainWidth: 1062,
      sideBarLeft: 1062,
      sideBarWidth: 170,
      sideBarVisible: true,
    }),
  ])
})

test('handleSashSideBarMove - side bar should collapse dragging makes width is much smaller than min width', async () => {
  Layout.state.mainWidth = 992
  Layout.state.sideBarLeft = 992
  Layout.state.sideBarVisible = true
  Layout.state.sideBarWidth = 240
  Layout.state.windowWidth = 1280
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      case 3024:
        break
      default:
        console.log({ message })
        throw new Error('unexpected message')
    }
  })
  await Layout.handleSashPointerDown('SideBar')
  await Layout.handleSashPointerMove(1192, 1192)
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(2)
  expect(RendererProcess.state.send).toHaveBeenNthCalledWith(1, [
    909090,
    expect.any(Number),
    1100,
    expect.objectContaining({
      mainWidth: 1232,
      sideBarLeft: 1232,
      sideBarWidth: 0,
      sideBarVisible: false,
    }),
  ])
})
