import * as MenuEntriesTerminal from '../src/parts/MenuEntries/MenuEntriesTerminal.js'

test('getMenuEntries', () => {
  const menuEntries = MenuEntriesTerminal.getMenuEntries()
  expect(menuEntries).toEqual([])
})
