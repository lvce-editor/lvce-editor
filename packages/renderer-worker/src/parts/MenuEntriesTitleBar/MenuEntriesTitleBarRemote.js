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
      flags: MenuItemFlags.SubMenu,
    },
    {
      id: MenuEntryId.Edit,
      label: I18nString.i18nString(UiStrings.Edit),
      flags: MenuItemFlags.SubMenu,
    },
    {
      id: MenuEntryId.Selection,
      label: I18nString.i18nString(UiStrings.Selection),
      flags: MenuItemFlags.SubMenu,
    },
    {
      id: MenuEntryId.View,
      label: I18nString.i18nString(UiStrings.View),
      flags: MenuItemFlags.SubMenu,
    },
    {
      id: MenuEntryId.Go,
      label: I18nString.i18nString(UiStrings.Go),
      flags: MenuItemFlags.SubMenu,
    },
    {
      id: MenuEntryId.Run,
      label: I18nString.i18nString(UiStrings.Run),
      keyboardShortCut: 'Alt+r',
      flags: MenuItemFlags.SubMenu,
    },
    {
      id: MenuEntryId.Terminal,
      label: I18nString.i18nString(UiStrings.Terminal),
      keyboardShortCut: 'Alt+t',
      flags: MenuItemFlags.SubMenu,
    },
    {
      id: MenuEntryId.Help,
      label: I18nString.i18nString(UiStrings.Help),
      keyboardShortCut: 'Alt+h',
      flags: MenuItemFlags.SubMenu,
    },
  ]
}
