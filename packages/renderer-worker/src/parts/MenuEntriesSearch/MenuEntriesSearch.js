import * as I18nString from '../I18NString/I18NString.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

/**
 * @enum {string}
 */
export const UiStrings = {
  CopyPath: 'Copy Path',
  Dismiss: 'Dismiss',
}

export const getMenuEntries = () => {
  return [
    {
      id: 'dismiss',
      label: I18nString.i18nString(UiStrings.Dismiss),
      flags: MenuItemFlags.None,
      command: /* TODO */ -1,
    },
    {
      id: 'copyPath',
      label: I18nString.i18nString(UiStrings.CopyPath),
      flags: MenuItemFlags.None,
      command: /* TODO */ -1,
    },
  ]
}
