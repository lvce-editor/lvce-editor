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
    {
      id: 'copyCommandId',
      label: KeyBindingStrings.copyCommandId(),
      flags: MenuItemFlags.None,
      command: 'KeyBindings.copyCommandId',
    },
    {
      id: 'copyCommandTitle',
      label: KeyBindingStrings.copyCommandTitle(),
      flags: MenuItemFlags.None,
      command: 'KeyBindings.copyCommandTitle',
    },
    {
      id: 'changeKeyBinding',
      label: KeyBindingStrings.changeKeyBinding(),
      flags: MenuItemFlags.None,
      command: 'KeyBindings.changeKeyBinding',
    },
    {
      id: 'addKeyBinding',
      label: KeyBindingStrings.addKeyBinding(),
      flags: MenuItemFlags.None,
      command: 'KeyBindings.addKeyBinding',
    },
    {
      id: 'removeKeyBinding',
      label: KeyBindingStrings.removeKeyBinding(),
      flags: MenuItemFlags.None,
      command: 'KeyBindings.removeKeyBinding',
    },
    {
      id: 'resetKeyBinding',
      label: KeyBindingStrings.resetKeyBinding(),
      flags: MenuItemFlags.None,
      command: 'KeyBindings.resetKeyBinding',
    },
    {
      id: 'changeWhenExpression',
      label: KeyBindingStrings.changeWhenExpression(),
      flags: MenuItemFlags.None,
      command: 'KeyBindings.changeWhenExpression',
    },
    {
      id: 'showSameKeyBindings',
      label: KeyBindingStrings.showSameKeyBindings(),
      flags: MenuItemFlags.None,
      command: 'KeyBindings.showSameKeyBindings',
    },
  ]
}
