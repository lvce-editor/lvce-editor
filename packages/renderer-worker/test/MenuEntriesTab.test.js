import * as MenuEntriesTab from '../src/parts/MenuEntriesTab/MenuEntriesTab.js'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test.skip('getMenuEntries', () => {
  const menuEntries = MenuEntriesTab.getMenuEntries()
  expect(menuEntries).toContainEqual({
    command: 'Main.closeFocusedTab',
    flags: MenuItemFlags.None,
    id: 'tabClose',
    label: 'Close',
  })
})
