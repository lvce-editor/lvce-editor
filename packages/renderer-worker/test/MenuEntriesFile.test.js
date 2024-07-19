import { expect, test } from '@jest/globals'
import * as MenuEntriesFile from '../src/parts/MenuEntriesFile/MenuEntriesFile.js'
import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.js'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'

test('getMenuEntries', () => {
  const menuEntries = MenuEntriesFile.getMenuEntries()
  expect(menuEntries).toContainEqual({
    command: -1,
    flags: MenuItemFlags.None,
    id: 'newFile',
    label: 'New File',
  })
  expect(menuEntries).toContainEqual({
    command: 'Dialog.openFolder',
    flags: MenuItemFlags.RestoreFocus,
    id: 'openFolder',
    label: 'Open Folder',
  })
  expect(menuEntries).toContainEqual({
    command: '',
    flags: MenuItemFlags.SubMenu,
    id: MenuEntryId.OpenRecent,
    label: 'Open Recent',
  })
})
