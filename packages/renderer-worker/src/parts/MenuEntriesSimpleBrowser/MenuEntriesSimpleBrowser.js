import * as I18nString from '../I18NString/I18NString.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

/**
 * @enum {string}
 */
export const UiStrings = {
  InspectElement: 'Inspect Element',
  Cut: 'Cut',
  Copy: 'Copy',
  Paste: 'Paste',
}

export const getMenuEntries = (x, y) => {
  return [
    {
      id: 'inspect-element',
      label: I18nString.i18nString(UiStrings.InspectElement),
      flags: MenuItemFlags.None,
      command: 'SimpleBrowser.inspectElement',
      args: [x, y],
    },
    {
      id: 'cut',
      label: I18nString.i18nString(UiStrings.Cut),
      flags: MenuItemFlags.None,
      command: 'SimpleBrowser.cut',
    },
    {
      id: 'copy',
      label: I18nString.i18nString(UiStrings.Copy),
      flags: MenuItemFlags.None,
      command: 'SimpleBrowser.copy',
    },
    {
      id: 'paste',
      label: I18nString.i18nString(UiStrings.Paste),
      flags: MenuItemFlags.None,
      command: 'SimpleBrowser.paste',
    },
  ]
}
