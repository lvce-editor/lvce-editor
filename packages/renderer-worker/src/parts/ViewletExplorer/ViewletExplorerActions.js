import * as ActionType from '../ActionType/ActionType.js'
import * as Icon from '../Icon/Icon.js'

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
      icon: Icon.NewFile,
      command: 'newFile',
    },
    {
      type: ActionType.Button,
      id: UiStrings.NewFolder,
      icon: Icon.NewFolder,
      command: 'newFolder',
    },
    {
      type: ActionType.Button,
      id: UiStrings.Refresh,
      icon: Icon.Refresh,
      command: 'refresh',
    },
    {
      type: ActionType.Button,
      id: UiStrings.CollapseAll,
      icon: Icon.CollapseAll,
      command: 'collapseAll',
    },
  ]
}
