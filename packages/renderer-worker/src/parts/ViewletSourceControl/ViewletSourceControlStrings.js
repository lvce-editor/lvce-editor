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
  Add: 'Add',
  Restore: 'Restore',
  Changes: 'Changes',
  StageAll: 'Stage All',
  Stage: 'Stage',
  Unstage: 'Unstage',
  UnstageAll: 'Unstage All Changes',
  Discard: 'Discard Changes',
  DiscardAll: 'Discard All Changes',
  ViewAsTree: 'View As Tree',
  CreatePullRequest: 'Create Pull Request',
  CommitAndPush: 'Commit and Push',
  Refresh: 'Refresh',
  MessageEnterToCommitOnMaster: `Message (Enter) to commit on 'master'`,
  SourceControlInput: 'Source Control Input',
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

export const discardAll = () => {
  return I18nString.i18nString(UiStrings.DiscardAll)
}

export const stageAll = () => {
  return I18nString.i18nString(UiStrings.StageAll)
}

export const discard = () => {
  return I18nString.i18nString(UiStrings.Discard)
}

export const stage = () => {
  return I18nString.i18nString(UiStrings.Stage)
}

export const unstageAll = () => {
  return I18nString.i18nString(UiStrings.UnstageAll)
}

export const unstage = () => {
  return I18nString.i18nString(UiStrings.Unstage)
}

export const viewAsTree = () => {
  return I18nString.i18nString(UiStrings.ViewAsTree)
}

export const createPullRequest = () => {
  return I18nString.i18nString(UiStrings.CreatePullRequest)
}

export const commitAndPush = () => {
  return I18nString.i18nString(UiStrings.CommitAndPush)
}

export const refresh = () => {
  return I18nString.i18nString(UiStrings.Refresh)
}

export const messageEnterToCommitOnMaster = () => {
  return I18nString.i18nString(UiStrings.MessageEnterToCommitOnMaster)
}

export const sourceControlInput = () => {
  return I18nString.i18nString(UiStrings.SourceControlInput)
}
