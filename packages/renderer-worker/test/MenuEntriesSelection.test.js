import * as MenuEntriesSelection from '../src/parts/MenuEntries/MenuEntriesSelection.js'

test('getMenuEntries', () => {
  expect(MenuEntriesSelection.getMenuEntries()).toContainEqual({
    id: 'selectAll',
    label: 'Select All',
    flags: 0,
    command: 'Editor.selectAll',
  })
})
