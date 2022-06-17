import * as MenuEntriesGo from '../src/parts/MenuEntries/MenuEntriesGo.js'

test('getMenuEntries', () => {
  const menuEntries = MenuEntriesGo.getMenuEntries()
  expect(menuEntries).toEqual([])
})
