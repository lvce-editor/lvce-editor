import * as MenuEntriesEdit from '../src/parts/MenuEntries/MenuEntriesEdit.js'

test('getMenuEntries', () => {
  const menuEntries = MenuEntriesEdit.getMenuEntries()
  expect(menuEntries).toContainEqual({
    command: 364,
    flags: 0,
    id: 'cut',
    label: 'Cut',
  })
  expect(menuEntries).toContainEqual({
    command: 365,
    flags: 0,
    id: 'copy',
    label: 'Copy',
  })
  expect(menuEntries).toContainEqual({
    command: 383,
    flags: 0,
    id: 'paste',
    label: 'Paste',
  })
})
