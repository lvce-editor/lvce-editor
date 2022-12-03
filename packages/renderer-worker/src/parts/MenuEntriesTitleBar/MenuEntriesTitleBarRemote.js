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
      label: I18nString.i18nString(UiStrings.File),
      flags: MenuItemFlags.None,
    },
    {
      id: MenuEntryId.Edit,
      label: I18nString.i18nString(UiStrings.Edit),
      flags: MenuItemFlags.None,
    },
    {
      id: MenuEntryId.Selection,
      label: I18nString.i18nString(UiStrings.Selection),
      flags: MenuItemFlags.None,
    },
    {
      id: MenuEntryId.View,
      label: I18nString.i18nString(UiStrings.View),
      flags: MenuItemFlags.None,
    },
    {
      id: MenuEntryId.Go,
      label: I18nString.i18nString(UiStrings.Go),
      flags: MenuItemFlags.None,
    },
    {
      id: MenuEntryId.Run,
      label: I18nString.i18nString(UiStrings.Run),
      keyboardShortCut: 'Alt+r',
      flags: MenuItemFlags.None,
    },
    {
      id: MenuEntryId.Terminal,
      label: I18nString.i18nString(UiStrings.Terminal),
      keyboardShortCut: 'Alt+t',
      flags: MenuItemFlags.None,
    },
    {
      id: MenuEntryId.Help,
      label: I18nString.i18nString(UiStrings.Help),
      keyboardShortCut: 'Alt+h',
      flags: MenuItemFlags.None,
    },
  ]
}
