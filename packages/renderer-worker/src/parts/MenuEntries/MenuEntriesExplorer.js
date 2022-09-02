import * as Viewlet from '../Viewlet/Viewlet.js'
import * as I18nString from '../I18NString/I18NString.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'

export const UiStrings = {
  NewFile: 'New File',
  NewFolder: 'New Folder',
  OpenContainingFolder: 'Open Containing Folder',
  OpenInIntegratedTerminal: 'Open in integrated Terminal',
  Separator: 'Separator',
  Cut: 'Cut',
  Copy: 'Copy',
  Paste: 'Paste',
  CopyPath: 'Copy Path',
  CopyRelativePath: 'Copy Relative Path',
  Rename: 'Rename',
  Delete: 'Delete',
}

const ALL_ENTRIES = [
  {
    id: 'newFile',
    label: I18nString.i18nString(UiStrings.NewFile),
    flags: MenuItemFlags.None,
    command: 'Explorer.newFile',
  },
  {
    id: 'newFolder',
    label: I18nString.i18nString(UiStrings.NewFolder),
    flags: MenuItemFlags.None,
    command: 'Explorer.newFolder',
  },
  {
    id: 'openContainingFolder',
    label: I18nString.i18nString(UiStrings.OpenContainingFolder),
    flags: MenuItemFlags.None,
    command: 'Explorer.openContainingFolder',
  },
  {
    id: 'openInIntegratedTerminal',
    label: I18nString.i18nString(UiStrings.OpenInIntegratedTerminal),
    flags: MenuItemFlags.None,
    command: /* TODO */ -1,
  },
  {
    id: '',
    label: I18nString.i18nString(UiStrings.Separator),
    flags: MenuItemFlags.Separator,
    command: /* TODO */ -1,
  },
  {
    id: 'cut',
    label: I18nString.i18nString(UiStrings.Cut),
    flags: MenuItemFlags.None,
    command: /* TODO */ -1,
  },
  {
    id: 'copy',
    label: I18nString.i18nString(UiStrings.Copy),
    flags: MenuItemFlags.None,
    command: 'Explorer.handleCopy',
  },
  {
    id: 'paste',
    label: I18nString.i18nString(UiStrings.Paste),
    flags: MenuItemFlags.None,
    command: 'Explorer.handlePaste',
  },
  {
    id: '',
    label: I18nString.i18nString(UiStrings.Separator),
    flags: MenuItemFlags.Separator,
    command: /* TODO */ -1,
  },
  {
    id: 'copyPath',
    label: I18nString.i18nString(UiStrings.CopyPath),
    flags: MenuItemFlags.None,
    command: 'Explorer.copyPath',
  },
  {
    id: 'copyRelativePath',
    label: I18nString.i18nString(UiStrings.CopyRelativePath),
    flags: MenuItemFlags.None,
    command: 'Explorer.copyRelativePath',
  },
  {
    id: '',
    label: I18nString.i18nString(UiStrings.Separator),
    flags: MenuItemFlags.Separator
    command: /* TODO */ -1,
  },
  {
    id: 'rename',
    label: I18nString.i18nString(UiStrings.Rename),
    flags: MenuItemFlags.None,
    command: 'Explorer.renameDirent',
  },
  {
    id: 'delete',
    label: I18nString.i18nString(UiStrings.Delete),
    flags: MenuItemFlags.None,
    command: 'Explorer.removeDirent',
  },
]

const isFileEntry = (entry) => {
  return entry.id !== 'newFile' && entry.id !== 'newFolder'
}

// TODO there are two possible ways of getting the focused dirent of explorer
// 1. directly access state of explorer (bad because it directly accesses state of another component)
// 2. expose getFocusedDirent method in explorer (bad because explorer code should not know about for menuEntriesExplorer, which needs that method)
const getFocusedDirent = () => {
  const explorerState = Viewlet.getState('Explorer')
  if (!explorerState || explorerState.focusedIndex < 0) {
    return undefined
  }
  return explorerState.dirents[explorerState.focusedIndex]
}

const getMenuEntriesDirectory = () => {
  return ALL_ENTRIES
}
const getMenuEntriesFile = () => {
  return ALL_ENTRIES.filter(isFileEntry)
}

const getMenuEntriesDefault = () => {
  return ALL_ENTRIES
}

export const getMenuEntries = () => {
  const focusedDirent = getFocusedDirent()
  if (!focusedDirent) {
    return ALL_ENTRIES
  }
  switch (focusedDirent.type) {
    case DirentType.Directory:
      return getMenuEntriesDirectory()
    case DirentType.File:
      return getMenuEntriesFile()
    default:
      return getMenuEntriesDefault()
  }
}
