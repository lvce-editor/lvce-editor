import * as ViewletTitleBarMenuBar from '../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBar.js'

test('create', () => {
  const state = ViewletTitleBarMenuBar.create()
  expect(state).toBeDefined()
})
