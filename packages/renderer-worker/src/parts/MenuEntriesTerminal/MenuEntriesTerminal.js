import * as I18nString from '../I18NString/I18NString.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

/**
 * @enum {string}
 */
export const UiStrings = {
  NewTerminal: 'New Terminal',
}

export const getMenuEntries = () => {
  return [
    {
      id: 'newTerminal',
      label: I18nString.i18nString(UiStrings.NewTerminal),
      flags: MenuItemFlags.None,
      command: 'Layout.togglePanel',
      args: ['Terminal'],
    },
  ]
}
