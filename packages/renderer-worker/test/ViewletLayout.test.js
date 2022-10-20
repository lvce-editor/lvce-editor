import * as ViewletLayout from '../src/parts/ViewletLayout/ViewletLayout.js'

const kWindowWidth = 0
const kWindowHeight = 1

const kMainVisible = 2
const kMainTop = 3
const kMainLeft = 4
const kMainWidth = 5
const kMainHeight = 6

const kActivityBarVisible = 7
const kActivityBarTop = 8
const kActivityBarLeft = 9
const kActivityBarWidth = 10
const kActivityBarHeight = 11

const kSideBarVisible = 12
const kSideBarTop = 13
const kSideBarLeft = 14
const kSideBarWidth = 15
const kSideBarHeight = 16
const kSideBarMinWidth = 17
const kSideBarMaxWidth = 18

const kPanelVisible = 19
const kpanelTop = 20
const kPanelLeft = 21
const kPanelWidth = 22
const kPanelHeight = 23
const kPanelMinHeight = 24
const kPanelMaxHeight = 25

const kStatusBarVisible = 26
const kStatusBarTop = 27
const kStatusBarLeft = 28
const kStatusBarWidth = 29
const kStatusBarHeight = 30

const kTitleBarVisible = 31
const kTitleBarTop = 32
const kTitleBarLeft = 33
const kTitleBarWidth = 34
const kTitleBarHeight = 35

const kTotal = 36

test('name', () => {
  expect(ViewletLayout.name).toBe('Layout')
})

test('create', () => {
  const state = ViewletLayout.create()
  expect(state).toBeDefined()
})

test.skip('showSideBar', async () => {
  const state = { ...ViewletLayout.create(), sideBarVisible: false }
  expect(await ViewletLayout.showSideBar(state)).toMatchObject({
    sideBarVisible: true,
  })
})

test.skip('hideSideBar', async () => {
  const state = { ...ViewletLayout.create(), sideBarVisible: true }
  expect(await ViewletLayout.hideSideBar(state)).toMatchObject({
    sideBarVisible: false,
  })
})

test.skip('toggleSideBar - show', async () => {
  const state = { ...ViewletLayout.create(), sideBarVisible: false }
  expect(await ViewletLayout.toggleSideBar(state)).toMatchObject({
    sideBarVisible: true,
  })
})

test.skip('toggleSideBar - hide', async () => {
  const state = { ...ViewletLayout.create(), sideBarVisible: true }
  expect(await ViewletLayout.toggleSideBar(state)).toMatchObject({
    sideBarVisible: false,
  })
})

test.skip('handleSashPointerMove - side bar', () => {
  const state = {
    ...ViewletLayout.create(),
    mainWidth: 992,
    sideBarLeft: 992,
    sideBarVisible: true,
    sideBarWidth: 240,
    windowWidth: 1280,
    sashId: 'SideBar',
  }
  expect(ViewletLayout.handleSashPointerMove(state, 892, 892)).toMatchObject({
    mainWidth: 892,
    sideBarLeft: 892,
    sideBarWidth: 340,
    sashId: 'SideBar',
  })
})

test.skip('handleSashPointerMove - side bar should stay at min width when dragging makes width a bit smaller than min width', async () => {
  const state = {
    ...ViewletLayout.create(),
    mainWidth: 992,
    sideBarLeft: 992,
    sideBarVisible: true,
    sideBarWidth: 240,
    windowWidth: 1280,
    sashId: 'SideBar',
  }
  expect(ViewletLayout.handleSashPointerMove(state, 1092, 1092)).toMatchObject({
    mainWidth: 1062,
    sideBarLeft: 1062,
    sideBarWidth: 170,
    sideBarVisible: true,
  })
})

test.skip('handleSashPointerMove - side bar should collapse dragging makes width is much smaller than min width', async () => {
  const state = {
    ...ViewletLayout.create(),
    mainWidth: 992,
    sideBarLeft: 992,
    sideBarVisible: true,
    sideBarWidth: 240,
    windowWidth: 1280,
    sashId: 'SideBar',
  }
  expect(ViewletLayout.handleSashPointerMove(state, 1192, 1192)).toMatchObject({
    mainWidth: 1232,
    sideBarLeft: 1232,
    sideBarWidth: 0,
    sideBarVisible: false,
  })
})

test('getInitialPlaceholderCommands', () => {
  const points = new Uint16Array(kTotal)
  points[kSideBarVisible] = 1
  points[kSideBarTop] = 0
  points[kSideBarLeft] = 600
  points[kSideBarWidth] = 200
  points[kSideBarHeight] = 200
  points[kStatusBarVisible] = 1
  points[kStatusBarTop] = 200
  points[kStatusBarLeft] = 0
  points[kSideBarWidth] = 800
  points[kStatusBarHeight] = 20
  const state = {
    ...ViewletLayout.create(),
    points,
  }
  expect(ViewletLayout.getInitialPlaceholderCommands(state)).toEqual([
    ['Viewlet.createPlaceholder', 'SideBar', 'Layout', 0, 600, 800, 200],
    ['Viewlet.createPlaceholder', 'StatusBar', 'Layout', 200, 0, 0, 20],
  ])
})
