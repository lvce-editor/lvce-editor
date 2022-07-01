import * as MenuEntriesEditor from '../src/parts/MenuEntries/MenuEntriesEditor.js'

test('getMenuEntries', () => {
  const menuEntries = MenuEntriesEditor.getMenuEntries()
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
