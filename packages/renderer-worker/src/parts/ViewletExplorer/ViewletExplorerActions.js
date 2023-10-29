import * as ActionType from '../ActionType/ActionType.js'

/**
 * @enum {string}
 */
const UiStrings = {
  NewFile: 'New File',
  NewFolder: 'New Folder',
  Refresh: 'Refresh',
  CollapseAll: 'Collapse All',
}

export const getActions = () => {
  return [
    {
      type: ActionType.Button,
      id: UiStrings.NewFile,
      icon: 'NewFile',
      command: 'newFile',
    },
    {
      type: ActionType.Button,
      id: UiStrings.NewFolder,
      icon: 'NewFolder',
      command: 'newFolder',
    },
    {
      type: ActionType.Button,
      id: UiStrings.Refresh,
      icon: 'Refresh',
      command: 'refresh',
    },
    {
      type: ActionType.Button,
      id: UiStrings.CollapseAll,
      icon: 'CollapseAll',
      command: 'collapseAll',
    },
  ]
}
