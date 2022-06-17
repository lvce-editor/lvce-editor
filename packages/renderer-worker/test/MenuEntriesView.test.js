import * as MenuEntriesView from '../src/parts/MenuEntries/MenuEntriesView.js'

test('getMenuEntries', () => {
  const menuEntries = MenuEntriesView.getMenuEntries()
  expect(menuEntries).toEqual([])
})
