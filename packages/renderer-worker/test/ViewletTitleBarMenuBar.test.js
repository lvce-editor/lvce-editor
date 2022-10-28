import * as ViewletModuleId from '../src/parts/ViewletModuleId/ViewletModuleId.js'
import * as ViewletTitleBarMenuBar from '../src/parts/ViewletTitleBarMenuBar/ViewletTitleBarMenuBar.js'

test('name', () => {
  expect(ViewletTitleBarMenuBar.name).toBe(ViewletModuleId.TitleBarMenuBar)
})

test('create', () => {
  const state = ViewletTitleBarMenuBar.create()
  expect(state).toBeDefined()
})
