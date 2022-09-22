import * as MenuEntriesView from '../src/parts/MenuEntriesView/MenuEntriesView.js'

test('getMenuEntries', () => {
  const menuEntries = MenuEntriesView.getMenuEntries()
  expect(menuEntries).toEqual([])
})
