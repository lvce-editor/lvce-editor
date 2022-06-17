import * as MenuEntriesManageExtension from '../src/parts/MenuEntries/MenuEntriesManageExtension.js'

test('getMenuEntries', () => {
  const menuEntries = MenuEntriesManageExtension.getMenuEntries()
  expect(menuEntries).toContainEqual({
    command: -1,
    flags: 0,
    id: 'enable',
    label: 'Enable',
  })
  expect(menuEntries).toContainEqual({
    command: -1,
    flags: 0,
    id: 'disable',
    label: 'Disable',
  })
})
