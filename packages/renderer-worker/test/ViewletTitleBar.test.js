import * as ViewletTitleBar from '../src/parts/ViewletTitleBar/ViewletTitleBar.js'

test('create', () => {
  const state = ViewletTitleBar.create()
  expect(state).toBeDefined()
})

test('loadContent', async () => {
  const state = ViewletTitleBar.create()
  expect(ViewletTitleBar.loadContent(state)).toBe(state)
})
