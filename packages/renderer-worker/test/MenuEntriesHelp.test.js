import * as MenuEntriesHelp from '../src/parts/MenuEntries/MenuEntriesHelp.js'

test('getMenuEntries', () => {
  const menuEntries = MenuEntriesHelp.getMenuEntries()
  expect(menuEntries).toContainEqual({
    command: 'Dialog.showAbout',
    flags: 0,
    id: 'about',
    label: 'About',
  })
})
