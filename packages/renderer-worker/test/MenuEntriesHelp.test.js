import * as MenuEntriesHelp from '../src/parts/MenuEntriesHelp/MenuEntriesHelp.js'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'

test('getMenuEntries', () => {
  const menuEntries = MenuEntriesHelp.getMenuEntries()
  expect(menuEntries).toContainEqual({
    command: 'About.showAbout',
    flags: MenuItemFlags.RestoreFocus,
    id: 'about',
    label: 'About',
  })
})
