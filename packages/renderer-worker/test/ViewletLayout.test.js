import * as ViewletLayout from '../src/parts/ViewletLayout/ViewletLayout.js'

test('name', () => {
  expect(ViewletLayout.name).toBe('Layout')
})

test('create', () => {
  const state = ViewletLayout.create()
  expect(state).toBeDefined()
})

test('showSideBar', () => {
  const state = { ...ViewletLayout.create(), sideBarVisible: false }
  expect(ViewletLayout.showSideBar(state)).toMatchObject({
    sideBarVisible: true,
  })
})

test('hideSideBar', () => {
  const state = { ...ViewletLayout.create(), sideBarVisible: true }
  expect(ViewletLayout.hideSideBar(state)).toMatchObject({
    sideBarVisible: false,
  })
})

test('toggleSideBar - show', () => {
  const state = { ...ViewletLayout.create(), sideBarVisible: false }
  expect(ViewletLayout.toggleSideBar(state)).toMatchObject({
    sideBarVisible: true,
  })
})

test('toggleSideBar - hide', () => {
  const state = { ...ViewletLayout.create(), sideBarVisible: true }
  expect(ViewletLayout.toggleSideBar(state)).toMatchObject({
    sideBarVisible: false,
  })
})

test.only('handleSashPointerMove - side bar', () => {
  const state = {
    ...ViewletLayout.create(),
    mainWidth: 992,
    sideBarLeft: 992,
    sideBarVisible: true,
    sideBarWidth: 240,
    windowWidth: 1280,
  }
  expect(ViewletLayout.handleSashPointerMove(state, 892, 892)).toMatchObject({
    mainWidth: 892,
    sideBarLeft: 892,
    sideBarWidth: 340,
    sashId: 'SideBar',
  })
})

test('handleSashPointerMove - side bar should stay at min width when dragging makes width a bit smaller than min width', async () => {
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

test('handleSashPointerMove - side bar should collapse dragging makes width is much smaller than min width', async () => {
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
