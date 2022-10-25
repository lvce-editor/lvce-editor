import * as I18nString from '../I18NString/I18NString.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

/**
 * @enum {string}
 */
export const UiStrings = {
  CommandPalette: 'Command Palette',
  Settings: 'Settings',
  KeyboardShortcuts: 'Keyboard Shortcuts',
  ColorTheme: 'Color Theme',
  CheckForUpdates: 'Check For Updates',
}

const keyBindingsUri = 'app://keybindings'

export const getMenuEntries = () => {
  return [
    {
      id: 'commandPalette',
      label: I18nString.i18nString(UiStrings.CommandPalette),
      flags: MenuItemFlags.None,
      command: 'Viewlet.openWidget',
      args: ['QuickPick', 'everything'],
    },
    {
      id: 'settings',
      label: I18nString.i18nString(UiStrings.Settings),
      flags: MenuItemFlags.None,
      command: 'Preferences.openSettingsJson',
    },
    {
      id: 'keyboardShortcuts',
      label: I18nString.i18nString(UiStrings.KeyboardShortcuts),
      flags: MenuItemFlags.None,
      command: 'Main.openUri',
      args: [keyBindingsUri],
    },
    {
      id: 'colorTheme',
      label: I18nString.i18nString(UiStrings.ColorTheme),
      flags: MenuItemFlags.None,
      command: 'Viewlet.openWidget',
      args: ['QuickPick', 'color-theme'],
    },
    {
      id: 'checkForUpdates',
      label: I18nString.i18nString(UiStrings.CheckForUpdates),
      flags: MenuItemFlags.None,
      command: /* TODO */ -1,
    },
  ]
}
