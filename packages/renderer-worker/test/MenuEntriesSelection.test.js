import * as MenuEntriesSelection from '../src/parts/MenuEntriesSelection/MenuEntriesSelection.js'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'

test('getMenuEntries', () => {
  expect(MenuEntriesSelection.getMenuEntries()).toContainEqual({
    id: 'selectAll',
    label: 'Select All',
    flags: MenuItemFlags.None,
    command: 'Editor.selectAll',
  })
})
