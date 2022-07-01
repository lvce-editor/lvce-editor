import * as MenuEntriesEdit from '../src/parts/MenuEntries/MenuEntriesEdit.js'

test('getMenuEntries', () => {
  const menuEntries = MenuEntriesEdit.getMenuEntries()
  expect(menuEntries).toContainEqual({
    command: 'Editor.cut',
    flags: 0,
    id: 'cut',
    label: 'Cut',
  })
  expect(menuEntries).toContainEqual({
    command: 'Editor.copy',
    flags: 0,
    id: 'copy',
    label: 'Copy',
  })
  expect(menuEntries).toContainEqual({
    command: 'Editor.paste',
    flags: 0,
    id: 'paste',
    label: 'Paste',
  })
})
