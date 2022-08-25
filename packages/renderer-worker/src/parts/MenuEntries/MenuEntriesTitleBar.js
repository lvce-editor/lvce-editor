import * as I18nString from '../I18NString/I18NString.js'
import * as Platform from '../Platform/Platform.js'

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
      id: 'file',
      name: I18nString.i18nString(UiStrings.File),
      flags: /* None */ 0,
    },
    {
      id: 'edit',
      name: I18nString.i18nString(UiStrings.Edit),
      flags: /* None */ 0,
    },
    {
      id: 'selection',
      name: I18nString.i18nString(UiStrings.Selection),
      flags: /* None */ 0,
    },
    {
      id: 'view',
      name: I18nString.i18nString(UiStrings.View),
      flags: /* None */ 0,
    },
    {
      id: 'go',
      name: I18nString.i18nString(UiStrings.Go),
      flags: /* None */ 0,
    },
  ]
}

const getMenuEntriesRemote = () => {
  return [
    {
      id: 'file',
      name: I18nString.i18nString(UiStrings.File),
      flags: /* None */ 0,
    },
    {
      id: 'edit',
      name: I18nString.i18nString(UiStrings.Edit),
      flags: /* None */ 0,
    },
    {
      id: 'selection',
      name: I18nString.i18nString(UiStrings.Selection),
      flags: /* None */ 0,
    },
    {
      id: 'view',
      name: I18nString.i18nString(UiStrings.View),
      flags: /* None */ 0,
    },
    {
      id: 'go',
      name: I18nString.i18nString(UiStrings.Go),
      flags: /* None */ 0,
    },
    {
      id: 'run',
      name: I18nString.i18nString(UiStrings.Run),
      keyboardShortCut: 'Alt+r',
      flags: /* None */ 0,
    },
    {
      id: 'terminal',
      name: I18nString.i18nString(UiStrings.Terminal),
      keyboardShortCut: 'Alt+t',
      flags: /* None */ 0,
    },
    {
      id: 'help',
      name: I18nString.i18nString(UiStrings.Help),
      keyboardShortCut: 'Alt+h',
      flags: /* None */ 0,
    },
  ]
}

export const getMenuEntries = () => {
  switch (Platform.platform) {
    case 'web':
      return getMenuEntriesWeb()
    case 'remote':
    case 'electron':
      return getMenuEntriesRemote()
    default:
      return []
  }
}
