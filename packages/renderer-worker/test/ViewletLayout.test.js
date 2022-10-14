import * as ViewletLayout from '../src/parts/ViewletLayout/ViewletLayout.js'

test('name', () => {
  expect(ViewletLayout.name).toBe('Layout')
})

test('create', () => {
  const state = ViewletLayout.create()
  expect(state).toBeDefined()
})

test('showSideBar', () => {
  const state = { ...ViewletLayout.create() }
})
