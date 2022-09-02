import * as Viewlet from '../Viewlet/Viewlet.js'
import * as I18nString from '../I18NString/I18NString.js'
import * as DirentType from '../DirentType/DirentType.js'

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
    flags: /* None */ 0,
    command: /* Explorer.newFile  */ 'Explorer.newFile',
  },
  {
    id: 'newFolder',
    label: I18nString.i18nString(UiStrings.NewFolder),
    flags: /* None */ 0,
    command: /* Explorer.newFolder */ 'Explorer.newFolder',
  },
  {
    id: 'openContainingFolder',
    label: I18nString.i18nString(UiStrings.OpenContainingFolder),
    flags: /* None */ 0,
    command:
      /*  Explorer.openContainingFolder */ 'Explorer.openContainingFolder',
  },
  {
    id: 'openInIntegratedTerminal',
    label: I18nString.i18nString(UiStrings.OpenInIntegratedTerminal),
    flags: /* None */ 0,
    command: /* TODO */ -1,
  },
  {
    id: '',
    label: I18nString.i18nString(UiStrings.Separator),
    flags: /* Separator */ 1,
    command: /* None */ 0,
  },
  {
    id: 'cut',
    label: I18nString.i18nString(UiStrings.Cut),
    flags: /* None */ 0,
    command: /* TODO */ -1,
  },
  {
    id: 'copy',
    label: I18nString.i18nString(UiStrings.Copy),
    flags: /* None */ 0,
    command: /* Explorer.handleCopy */ 'Explorer.handleCopy',
  },
  {
    id: 'paste',
    label: I18nString.i18nString(UiStrings.Paste),
    flags: /* None */ 0,
    command: /* Explorer.handlePaste */ 'Explorer.handlePaste',
  },
  {
    id: '',
    label: I18nString.i18nString(UiStrings.Separator),
    flags: /* Separator */ 1,
    command: /* None */ 0,
  },
  {
    id: 'copyPath',
    label: I18nString.i18nString(UiStrings.CopyPath),
    flags: /* None */ 0,
    command: /* TODO */ -1,
  },
  {
    id: 'copyRelativePath',
    label: I18nString.i18nString(UiStrings.CopyRelativePath),
    flags: /* None */ 0,
    command: /* TODO */ -1,
  },
  {
    id: '',
    label: I18nString.i18nString(UiStrings.Separator),
    flags: /* Separator */ 1,
    command: /* None */ 0,
  },
  {
    id: 'rename',
    label: I18nString.i18nString(UiStrings.Rename),
    flags: /* None */ 0,
    command: /* Explorer.renameDirent */ 'Explorer.renameDirent',
  },
  {
    id: 'delete',
    label: I18nString.i18nString(UiStrings.Delete),
    flags: /* None */ 0,
    command: /* Explorer.removeDirent */ 'Explorer.removeDirent',
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
