import * as I18nString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
export const UiStrings = {
  OpenChanges: 'Open Changes',
  OpenFile: 'Open File',
  OpenFileHead: 'Open File (HEAD)',
  DiscardChanges: 'Discard Changes',
  StageChanges: 'Stage Changes',
  AddToGitignore: 'Add to gitignore',
  RevealInExplorerView: 'Reveal in Explorer View',
  OpenContainingFolder: 'Open Containing Folder',
}

export const openChanges = () => {
  return I18nString.i18nString(UiStrings.OpenChanges)
}

export const openFile = () => {
  return I18nString.i18nString(UiStrings.OpenFile)
}
export const openFileHead = () => {
  return I18nString.i18nString(UiStrings.OpenFileHead)
}

export const discardChanges = () => {
  return I18nString.i18nString(UiStrings.DiscardChanges)
}

export const stageChanges = () => {
  return I18nString.i18nString(UiStrings.StageChanges)
}

export const addToGitignore = () => {
  return I18nString.i18nString(UiStrings.AddToGitignore)
}

export const revealInExplorerView = () => {
  return I18nString.i18nString(UiStrings.RevealInExplorerView)
}

export const openContainingFolder = () => {
  return I18nString.i18nString(UiStrings.OpenContainingFolder)
}
