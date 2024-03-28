import * as MenuEntriesManageExtension from '../src/parts/MenuEntriesManageExtension/MenuEntriesManageExtension.js'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('getMenuEntries', () => {
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
