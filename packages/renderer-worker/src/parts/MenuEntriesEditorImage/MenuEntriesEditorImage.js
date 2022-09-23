import * as I18nString from '../I18NString/I18NString.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

/**
 * @enum {string}
 */
export const UiStrings = {
  Copy: 'Copy',
  CopyPath: 'Copy Path',
}

export const getMenuEntries = () => {
  return [
    {
      id: 'copy',
      label: I18nString.i18nString(UiStrings.Copy),
      flags: MenuItemFlags.None,
      command: 'EditorImage.copyImage',
    },
    {
      id: 'copyToClipBoard',
      label: I18nString.i18nString(UiStrings.CopyPath),
      flags: MenuItemFlags.None,
      command: 'EditorImage.copyPath',
    },
  ]
}
