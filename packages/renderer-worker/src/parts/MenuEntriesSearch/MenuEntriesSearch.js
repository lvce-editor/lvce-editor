import * as I18nString from '../I18NString/I18NString.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

/**
 * @enum {string}
 */
export const UiStrings = {
  CopyPath: 'Copy Path',
}

export const getMenuEntries = () => {
  return [
    {
      id: 'copyPath',
      label: I18nString.i18nString(UiStrings.CopyPath),
      flags: MenuItemFlags.None,
      command: /* TODO */ -1,
    },
  ]
}
