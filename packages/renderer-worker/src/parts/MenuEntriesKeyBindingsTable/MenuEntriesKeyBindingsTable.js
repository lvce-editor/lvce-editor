import * as KeyBindingStrings from '../KeyBindingStrings/KeyBindingStrings.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

export const id = MenuEntryId.KeyBindingsTable

export const getMenuEntries = () => {
  return [
    {
      id: 'copy',
      label: KeyBindingStrings.copy(),
      flags: MenuItemFlags.None,
      command: 'KeyBindings.copy',
    },
  ]
}
