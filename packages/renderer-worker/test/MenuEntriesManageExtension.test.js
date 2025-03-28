import { expect, test } from '@jest/globals'
import * as MenuEntriesManageExtension from '../src/parts/MenuEntriesManageExtension/MenuEntriesManageExtension.js'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'

test.skip('getMenuEntries', () => {
  const menuEntries = MenuEntriesManageExtension.getMenuEntries()
  expect(menuEntries).toContainEqual({
    command: -1,
    flags: MenuItemFlags.None,
    id: 'enable',
    label: 'Enable',
  })
  expect(menuEntries).toContainEqual({
    command: -1,
    flags: MenuItemFlags.None,
    id: 'disable',
    label: 'Disable',
  })
})
