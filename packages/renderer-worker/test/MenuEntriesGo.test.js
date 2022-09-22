import * as MenuEntriesGo from '../src/parts/MenuEntriesGo/MenuEntriesGo.js'

test('getMenuEntries', () => {
  const menuEntries = MenuEntriesGo.getMenuEntries()
  expect(menuEntries).toEqual([])
})
