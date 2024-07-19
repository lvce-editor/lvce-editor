import { expect, test } from '@jest/globals'
import * as MenuEntriesEdit from '../src/parts/MenuEntriesEdit/MenuEntriesEdit.js'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'

test('getMenuEntries', () => {
  const menuEntries = MenuEntriesEdit.getMenuEntries()
  expect(menuEntries).toContainEqual({
    command: 'Editor.cut',
    flags: MenuItemFlags.None,
    id: 'cut',
    label: 'Cut',
  })
  expect(menuEntries).toContainEqual({
    command: 'Editor.copy',
    flags: MenuItemFlags.None,
    id: 'copy',
    label: 'Copy',
  })
  expect(menuEntries).toContainEqual({
    command: 'Editor.paste',
    flags: MenuItemFlags.None,
    id: 'paste',
    label: 'Paste',
  })
})
