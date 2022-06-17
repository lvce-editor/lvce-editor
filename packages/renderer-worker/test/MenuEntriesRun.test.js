import * as MenuEntriesRun from '../src/parts/MenuEntries/MenuEntriesRun.js'

test('getMenuEntries', () => {
  const menuEntries = MenuEntriesRun.getMenuEntries()
  expect(menuEntries).toEqual([])
})
