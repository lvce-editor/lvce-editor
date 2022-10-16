import * as ViewletLayout from '../src/parts/ViewletLayout/ViewletLayout.js'

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
