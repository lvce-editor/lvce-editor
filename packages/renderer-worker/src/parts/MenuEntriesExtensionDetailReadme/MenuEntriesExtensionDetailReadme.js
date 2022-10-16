import * as I18nString from '../I18NString/I18NString.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

/**
 * @enum {string}
 */
export const UiStrings = {
  Copy: 'Copy',
}

export const getMenuEntries = () => {
  return [
    {
      id: 'copy',
      label: I18nString.i18nString(UiStrings.Copy),
      flags: MenuItemFlags.None,
      command: 'ClipBoard.execCopy',
    },
  ]
}
