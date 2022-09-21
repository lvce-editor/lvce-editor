import * as I18nString from '../I18NString/I18NString.js'
import * as Platform from '../Platform/Platform.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as PlatformType from '../PlatformType/PlatformType.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'

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

const getMenuEntriesWeb = () => {
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

const getMenuEntriesRemote = () => {
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
    {
      id: MenuEntryId.Run,
      name: I18nString.i18nString(UiStrings.Run),
      keyboardShortCut: 'Alt+r',
      flags: MenuItemFlags.None,
    },
    {
      id: MenuEntryId.Terminal,
      name: I18nString.i18nString(UiStrings.Terminal),
      keyboardShortCut: 'Alt+t',
      flags: MenuItemFlags.None,
    },
    {
      id: MenuEntryId.Help,
      name: I18nString.i18nString(UiStrings.Help),
      keyboardShortCut: 'Alt+h',
      flags: MenuItemFlags.None,
    },
  ]
}

export const getMenuEntries = () => {
  switch (Platform.platform) {
    case PlatformType.Web:
      return getMenuEntriesWeb()
    case PlatformType.Remote:
    case PlatformType.Electron:
      return getMenuEntriesRemote()
    default:
      return []
  }
}
