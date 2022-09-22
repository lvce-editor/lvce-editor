import * as I18nString from '../I18NString/I18NString.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

const UiStrings = {
  File: 'File',
  Edit: 'Edit',
  Selection: 'Selection',
  View: 'View',
  Go: 'Go',
  Run: 'Run',
  Terminal: 'Terminal',
  Help: 'Help',
}

export const getMenuEntries = () => {
  return [
    {
      id: MenuEntryId.File,
      name: I18nString.i18nString(UiStrings.File),
      flags: MenuItemFlags.None,
    },
    {
      id: MenuEntryId.Edit,
      name: I18nString.i18nString(UiStrings.Edit),
      flags: MenuItemFlags.None,
    },
    {
      id: MenuEntryId.Selection,
      name: I18nString.i18nString(UiStrings.Selection),
      flags: MenuItemFlags.None,
    },
    {
      id: MenuEntryId.View,
      name: I18nString.i18nString(UiStrings.View),
      flags: MenuItemFlags.None,
    },
    {
      id: MenuEntryId.Go,
      name: I18nString.i18nString(UiStrings.Go),
      flags: MenuItemFlags.None,
    },
  ]
}
