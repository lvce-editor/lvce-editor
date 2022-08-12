import * as MenuEntriesTab from '../src/parts/MenuEntries/MenuEntriesTab.js'

test.skip('getMenuEntries', () => {
  const menuEntries = MenuEntriesTab.getMenuEntries()
  expect(menuEntries).toContainEqual({
    command: 'Main.closeFocusedTab',
    flags: 0,
    id: 'tabClose',
    label: 'Close',
  })
})
