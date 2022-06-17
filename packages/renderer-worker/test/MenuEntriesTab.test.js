import * as MenuEntriesTab from '../src/parts/MenuEntries/MenuEntriesTab.js'

test('getMenuEntries', () => {
  const menuEntries = MenuEntriesTab.getMenuEntries()
  expect(menuEntries).toContainEqual({
    command: 105,
    flags: 0,
    id: 'tabClose',
    label: 'Close',
  })
})
