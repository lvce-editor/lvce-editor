import * as Assert from '../Assert/Assert.js'
import * as Icon from '../Icon/Icon.js'

/**
 * @enum {string}
 */
const UiStrings = {
  Add: 'Add',
  Restore: 'Restore',
  OpenFile: 'Open File',
  Changes: 'Changes',
  StageAll: 'Stage All',
  Stage: 'Stage',
  Unstage: 'Unstage',
  UnstageAll: 'Unstage All Changes',
  Discard: 'Discard Changes',
}

/**
 * @enum {string}
 */
const Commands = {
  StageAll: 'git.stageAll',
  OpenFile: 'git.openFile',
  Stage: 'git.stage',
  UnstageAll: 'git.unstageAll',
  Unstage: 'git.unstage',
  Discard: 'git.discard',
}

/**
 * @enum {string}
 */
const ContextId = {
  WorkingTree: 'working-tree',
  WorkingTreeItem: 'working-tree-item',
  Index: 'index',
  IndexItem: 'index-item',
}

const getContextId = (groupId, type) => {
  if (type === 'file') {
    return `${groupId}-item`
  }
  return groupId
}

const getSourceControlActionsWorkingTree = () => {
  return [
    {
      command: Commands.StageAll,
      label: UiStrings.StageAll,
      icon: Icon.Add,
    },
  ]
}

const getSourceControlActionsWorkingTreeItem = () => {
  return [
    {
      command: Commands.OpenFile,
      label: UiStrings.OpenFile,
      icon: Icon.GoToFile,
    },
    {
      command: Commands.Discard,
      label: UiStrings.Discard,
      icon: Icon.Discard,
    },
    {
      command: Commands.Stage,
      label: UiStrings.Stage,
      icon: Icon.Add,
    },
  ]
}

const getSourceControlActionsIndex = () => {
  return [
    {
      command: Commands.UnstageAll,
      label: UiStrings.UnstageAll,
      icon: Icon.Remove,
    },
  ]
}

const getSourceControlIndexItem = () => {
  return [
    {
      command: Commands.OpenFile,
      label: UiStrings.OpenFile,
      icon: Icon.GoToFile,
    },
    {
      command: Commands.Unstage,
      label: UiStrings.Unstage,
      icon: Icon.Remove,
    },
  ]
}

export const getSourceControlActions = async (providerId, groupId, type) => {
  // TODO get source-control-actions from extension.json file
  Assert.string(groupId)
  const contextId = getContextId(groupId, type)
  switch (contextId) {
    case ContextId.WorkingTree:
      return getSourceControlActionsWorkingTree()
    case ContextId.WorkingTreeItem:
      return getSourceControlActionsWorkingTreeItem()
    case ContextId.Index:
      return getSourceControlActionsIndex()
    case ContextId.IndexItem:
      return getSourceControlIndexItem()
    default:
      return []
  }
}
