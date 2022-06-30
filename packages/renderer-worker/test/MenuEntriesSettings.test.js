import * as MenuEntriesSettings from '../src/parts/MenuEntries/MenuEntriesSettings.js'

test('getMenuEntries', () => {
  const menuEntries = MenuEntriesSettings.getMenuEntries()
  expect(menuEntries).toContainEqual({
    id: 'settings',
    label: 'Settings',
    flags: 0,
    command: 'Preferences.openSettingsJson',
  })
})
