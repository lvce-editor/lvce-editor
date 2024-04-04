import * as HelpStrings from '../HelpStrings/HelpStrings.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as MenuEntrySeparator from '../MenuEntrySeparator/MenuEntrySeparator.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

const keyBindingsUri = 'app://keybindings'

export const id = MenuEntryId.Settings

export const getMenuEntries = () => {
  return [
    {
      id: 'commandPalette',
      label: HelpStrings.commandPalette(),
      flags: MenuItemFlags.None,
      command: 'QuickPick.showEverything',
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      id: 'settings',
      label: HelpStrings.settings(),
      flags: MenuItemFlags.None,
      command: 'Preferences.openSettingsJson',
    },
    {
      id: 'keyboardShortcuts',
      label: HelpStrings.keyboardShortcuts(),
      flags: MenuItemFlags.None,
      command: 'Main.openUri',
      args: [keyBindingsUri],
    },
    {
      id: 'colorTheme',
      label: HelpStrings.colorTheme(),
      flags: MenuItemFlags.None,
      command: 'QuickPick.showColorTheme',
    },
    MenuEntrySeparator.menuEntrySeparator,
    {
      id: 'checkForUpdates',
      label: HelpStrings.checkForUpdates(),
      flags: MenuItemFlags.None,
      command: /* TODO */ -1,
    },
  ]
}
