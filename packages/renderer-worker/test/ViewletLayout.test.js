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
