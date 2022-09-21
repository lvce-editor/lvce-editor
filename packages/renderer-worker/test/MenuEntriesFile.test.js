import * as MenuEntriesFile from '../src/parts/MenuEntries/MenuEntriesFile.js'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'
import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.js'

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
    flags: MenuItemFlags.None,
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
