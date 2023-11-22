import * as ActionType from '../ActionType/ActionType.js'
import * as MaskIcon from '../MaskIcon/MaskIcon.js'

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
      icon: MaskIcon.NewFile,
      command: 'newFile',
    },
    {
      type: ActionType.Button,
      id: UiStrings.NewFolder,
      icon: MaskIcon.NewFolder,
      command: 'newFolder',
    },
    {
      type: ActionType.Button,
      id: UiStrings.Refresh,
      icon: MaskIcon.Refresh,
      command: 'refresh',
    },
    {
      type: ActionType.Button,
      id: UiStrings.CollapseAll,
      icon: MaskIcon.CollapseAll,
      command: 'collapseAll',
    },
  ]
}
