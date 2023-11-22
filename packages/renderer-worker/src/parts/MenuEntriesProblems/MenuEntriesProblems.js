import * as I18nString from '../I18NString/I18NString.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

/**
 * @enum {string}
 */
export const UiStrings = {
  Copy: 'Copy',
  CopyMessage: 'Copy Message',
}

export const getMenuEntries = () => {
  return [
    {
      id: 'copy',
      label: I18nString.i18nString(UiStrings.Copy),
      flags: MenuItemFlags.None,
      command: 'Problems.copy',
    },
    {
      id: 'copyMessage',
      label: I18nString.i18nString(UiStrings.CopyMessage),
      flags: MenuItemFlags.None,
      command: 'Problems.copyMessage',
    },
  ]
}
