import * as I18nString from '../I18NString/I18NString.js'

export const UiStrings = {
  Settings: 'Settings',
  KeyboardShortcuts: 'Keyboard Shortcuts',
  ColorTheme: 'Color Theme',
  CheckForUpdates: 'Check For Updates',
}

export const getMenuEntries = () => {
  return [
    {
      id: 'settings',
      label: I18nString.i18nString(UiStrings.Settings),
      flags: /* None */ 0,
      command: 'Preferences.openSettingsJson',
    },
    {
      id: 'keyboardShortcuts',
      label: I18nString.i18nString(UiStrings.KeyboardShortcuts),
      flags: /* None */ 0,
      command: /* TODO */ -1,
    },
    {
      id: 'colorTheme',
      label: I18nString.i18nString(UiStrings.ColorTheme),
      flags: /* None */ 0,
      command: 'QuickPick.openColorTheme',
    },
    {
      id: 'checkForUpdates',
      label: I18nString.i18nString(UiStrings.CheckForUpdates),
      flags: /* None */ 0,
      command: /* TODO */ -1,
    },
  ]
}
