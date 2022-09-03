import * as I18nString from '../I18NString/I18NString.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

export const UiStrings = {
  Enable: 'Enable',
  Disable: 'Disable',
  Uninstall: 'Uninstall',
  InstallAnotherVersion: 'Install Another Version',
}

export const getMenuEntries = () => {
  return [
    {
      id: 'enable',
      label: I18nString.i18nString(UiStrings.Enable),
      flags: MenuItemFlags.None,
      command: -1,
    },
    {
      id: 'disable',
      label: I18nString.i18nString(UiStrings.Disable),
      flags: MenuItemFlags.None,
      command: -1,
    },
    {
      id: 'uninstall',
      label: I18nString.i18nString(UiStrings.Disable),
      flags: MenuItemFlags.None,
      command: -1,
    },
    {
      id: 'installAnotherVersion',
      label: I18nString.i18nString(UiStrings.InstallAnotherVersion),
      flags: MenuItemFlags.None,
      command: -1,
    },
  ]
}
