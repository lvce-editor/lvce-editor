import * as DirentType from '../DirentType/DirentType.js'
import * as I18nString from '../I18NString/I18NString.js'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.js'
import * as Viewlet from '../Viewlet/Viewlet.js'

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

const menuEntryNewFile = {
  id: 'newFile',
  label: I18nString.i18nString(UiStrings.NewFile),
  flags: MenuItemFlags.None,
  command: 'Explorer.newFile',
}

const menuEntryNewFolder = {
  id: 'newFolder',
  label: I18nString.i18nString(UiStrings.NewFolder),
  flags: MenuItemFlags.None,
  command: 'Explorer.newFolder',
}

const menuEntryOpenContainingFolder = {
  id: 'openContainingFolder',
  label: I18nString.i18nString(UiStrings.OpenContainingFolder),
  flags: MenuItemFlags.RestoreFocus,
  command: 'Explorer.openContainingFolder',
}

const menuEntryOpenInIntegratedTerminal = {
  id: 'openInIntegratedTerminal',
  label: I18nString.i18nString(UiStrings.OpenInIntegratedTerminal),
  flags: MenuItemFlags.None,
  command: /* TODO */ -1,
}

const menuEntrySeparator = {
  id: '',
  label: I18nString.i18nString(UiStrings.Separator),
  flags: MenuItemFlags.Separator,
  command: /* TODO */ -1,
}

const menuEntryCut = {
  id: 'cut',
  label: I18nString.i18nString(UiStrings.Cut),
  flags: MenuItemFlags.RestoreFocus,
  command: /* TODO */ -1,
}

const menuEntryCopy = {
  id: 'copy',
  label: I18nString.i18nString(UiStrings.Copy),
  flags: MenuItemFlags.RestoreFocus,
  command: 'Explorer.handleCopy',
}

const menuEntryPaste = {
  id: 'paste',
  label: I18nString.i18nString(UiStrings.Paste),
  flags: MenuItemFlags.None,
  command: 'Explorer.handlePaste',
}

const menuEntryCopyPath = {
  id: 'copyPath',
  label: I18nString.i18nString(UiStrings.CopyPath),
  flags: MenuItemFlags.RestoreFocus,
  command: 'Explorer.copyPath',
}

const menuEntryCopyRelativePath = {
  id: 'copyRelativePath',
  label: I18nString.i18nString(UiStrings.CopyRelativePath),
  flags: MenuItemFlags.RestoreFocus,
  command: 'Explorer.copyRelativePath',
}

const menuEntryRename = {
  id: 'rename',
  label: I18nString.i18nString(UiStrings.Rename),
  flags: MenuItemFlags.None,
  command: 'Explorer.renameDirent',
}

const menuEntryDelete = {
  id: 'delete',
  label: I18nString.i18nString(UiStrings.Delete),
  flags: MenuItemFlags.None,
  command: 'Explorer.removeDirent',
}

const ALL_ENTRIES = [
  menuEntryNewFile,
  menuEntryNewFolder,
  menuEntryOpenContainingFolder,
  menuEntryOpenInIntegratedTerminal,
  menuEntrySeparator,
  menuEntryCut,
  menuEntryCopy,
  menuEntryPaste,
  menuEntrySeparator,
  menuEntryCopyPath,
  menuEntryCopyRelativePath,
  menuEntrySeparator,
  menuEntryRename,
  menuEntryDelete,
]

// TODO there are two possible ways of getting the focused dirent of explorer
// 1. directly access state of explorer (bad because it directly accesses state of another component)
// 2. expose getFocusedDirent method in explorer (bad because explorer code should not know about for menuEntriesExplorer, which needs that method)
const getFocusedDirent = () => {
  const explorerState = Viewlet.getState('Explorer')
  if (!explorerState || explorerState.focusedIndex < 0) {
    return undefined
  }
  return explorerState.items[explorerState.focusedIndex]
}

const getMenuEntriesDirectory = () => {
  return ALL_ENTRIES
}
const getMenuEntriesFile = () => {
  return [
    menuEntryOpenContainingFolder,
    menuEntryOpenInIntegratedTerminal,
    menuEntrySeparator,
    menuEntryCut,
    menuEntryCopy,
    menuEntryPaste,
    menuEntrySeparator,
    menuEntryCopyPath,
    menuEntryCopyRelativePath,
    menuEntrySeparator,
    menuEntryRename,
    menuEntryDelete,
  ]
}

const getMenuEntriesDefault = () => {
  return ALL_ENTRIES
}

const getMenuEntriesRoot = () => {
  return [
    menuEntryNewFile,
    menuEntryNewFolder,
    menuEntryOpenContainingFolder,
    menuEntryOpenInIntegratedTerminal,
    menuEntrySeparator,
    menuEntryPaste,
    menuEntrySeparator,
    menuEntryCopyPath,
    menuEntryCopyRelativePath,
  ]
}

export const getMenuEntries = () => {
  const focusedDirent = getFocusedDirent()
  if (!focusedDirent) {
    return getMenuEntriesRoot()
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
