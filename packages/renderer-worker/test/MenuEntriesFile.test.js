import * as MenuEntriesFile from '../src/parts/MenuEntries/MenuEntriesFile.js'

test('getMenuEntries', () => {
  const menuEntries = MenuEntriesFile.getMenuEntries()
  expect(menuEntries).toContainEqual({
    command: -1,
    flags: 5,
    id: 'newFile',
    label: 'New File',
  })
  expect(menuEntries).toContainEqual({
    command: 'Dialog.openFolder',
    flags: 0,
    id: 'openFolder',
    label: 'Open Folder',
  })
  expect(menuEntries).toContainEqual({
    command: 0,
    flags: 4,
    id: 'openRecent',
    label: 'Open Recent',
  })
})
