import * as MenuEntriesSettings from '../src/parts/MenuEntriesSettings/MenuEntriesSettings.js'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('getMenuEntries', () => {
  const menuEntries = MenuEntriesSettings.getMenuEntries()
  expect(menuEntries).toContainEqual({
    id: 'settings',
    label: 'Settings',
    flags: MenuItemFlags.None,
    command: 'Preferences.openSettingsJson',
  })
})
