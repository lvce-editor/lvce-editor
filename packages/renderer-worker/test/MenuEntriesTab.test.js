import { expect, test } from '@jest/globals'
import * as MenuEntriesTab from '../src/parts/MenuEntriesTab/MenuEntriesTab.js'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'

test.skip('getMenuEntries', () => {
  const menuEntries = MenuEntriesTab.getMenuEntries()
  expect(menuEntries).toContainEqual({
    command: 'Main.closeFocusedTab',
    flags: MenuItemFlags.None,
    id: 'tabClose',
    label: 'Close',
  })
})
