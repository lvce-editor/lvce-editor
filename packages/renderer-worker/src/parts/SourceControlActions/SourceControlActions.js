import * as Assert from '../Assert/Assert.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as ViewletSourceControlStrings from '../ViewletSourceControl/ViewletSourceControlStrings.js'

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
  DiscardAll: 'git.cleanAll',
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
  if (type === DirentType.File) {
    return `${groupId}-item`
  }
  return groupId
}

const getSourceControlActionsWorkingTree = () => {
  return [
    {
      command: Commands.DiscardAll,
      label: ViewletSourceControlStrings.discardAll(),
      icon: 'Discard',
    },
    {
      command: Commands.StageAll,
      label: ViewletSourceControlStrings.stageAll(),
      icon: 'Add',
    },
  ]
}

const getSourceControlActionsWorkingTreeItem = () => {
  return [
    {
      command: Commands.OpenFile,
      label: ViewletSourceControlStrings.openFile(),
      icon: 'GoToFile',
    },
    {
      command: Commands.Discard,
      label: ViewletSourceControlStrings.discard(),
      icon: 'Discard',
    },
    {
      command: Commands.Stage,
      label: ViewletSourceControlStrings.stage(),
      icon: 'Add',
    },
  ]
}

const getSourceControlActionsIndex = () => {
  return [
    {
      command: Commands.UnstageAll,
      label: ViewletSourceControlStrings.unstageAll(),
      icon: 'Remove',
    },
  ]
}

const getSourceControlIndexItem = () => {
  return [
    {
      command: Commands.OpenFile,
      label: ViewletSourceControlStrings.openFile(),
      icon: 'GoToFile',
    },
    {
      command: Commands.Unstage,
      label: ViewletSourceControlStrings.unstage(),
      icon: 'Remove',
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
