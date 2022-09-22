import * as MenuEntriesTerminal from '../src/parts/MenuEntriesTerminal/MenuEntriesTerminal.js'

test('getMenuEntries', () => {
  const menuEntries = MenuEntriesTerminal.getMenuEntries()
  expect(menuEntries).toEqual([])
})
