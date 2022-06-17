import * as MenuEntriesHelp from '../src/parts/MenuEntries/MenuEntriesHelp.js'

test('getMenuEntries', () => {
  const menuEntries = MenuEntriesHelp.getMenuEntries()
  expect(menuEntries).toContainEqual({
    command: 1493,
    flags: 0,
    id: 'about',
    label: 'About',
  })
})
