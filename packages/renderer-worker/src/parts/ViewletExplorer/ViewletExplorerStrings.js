import * as I18nString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  NewFile: 'New File...',
  NewFolder: 'New Folder...',
  OpenContainingFolder: 'Open Containing Folder',
  OpenInIntegratedTerminal: 'Open in integrated Terminal',
  Cut: 'Cut',
  Copy: 'Copy',
  Paste: 'Paste',
  CopyPath: 'Copy Path',
  CopyRelativePath: 'Copy Relative Path',
  Rename: 'Rename',
  Delete: 'Delete',
  RefreshExplorer: 'Refresh Explorer',
  CollapseAllFoldersInExplorer: 'Collapse All Folders in Explorer',
  Explorer: 'Explorer',
  FilesExplorer: 'Files Explorer',
}

export const newFile = () => {
  return I18nString.i18nString(UiStrings.NewFile)
}

export const newFolder = () => {
  return I18nString.i18nString(UiStrings.NewFolder)
}

export const openContainingFolder = () => {
  return I18nString.i18nString(UiStrings.OpenContainingFolder)
}

export const openInIntegratedTerminal = () => {
  return I18nString.i18nString(UiStrings.OpenInIntegratedTerminal)
}

export const cut = () => {
  return I18nString.i18nString(UiStrings.Cut)
}

export const copy = () => {
  return I18nString.i18nString(UiStrings.Copy)
}

export const paste = () => {
  return I18nString.i18nString(UiStrings.Paste)
}

export const copyPath = () => {
  return I18nString.i18nString(UiStrings.CopyPath)
}

export const copyRelativePath = () => {
  return I18nString.i18nString(UiStrings.CopyRelativePath)
}

export const rename = () => {
  return I18nString.i18nString(UiStrings.Rename)
}

export const deleteItem = () => {
  return I18nString.i18nString(UiStrings.Delete)
}

export const refresh = () => {
  return I18nString.i18nString(UiStrings.RefreshExplorer)
}

export const collapseAll = () => {
  return I18nString.i18nString(UiStrings.CollapseAllFoldersInExplorer)
}

export const explorer = () => {
  return I18nString.i18nString(UiStrings.Explorer)
}

export const filesExplorer = () => {
  return I18nString.i18nString(UiStrings.FilesExplorer)
}
