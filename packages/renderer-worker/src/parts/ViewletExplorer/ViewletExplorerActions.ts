import * as ActionType from '../ActionType/ActionType.js'
import * as MaskIcon from '../MaskIcon/MaskIcon.js'
import * as ViewletExplorerStrings from './ViewletExplorerStrings.js'
import type { ViewletAction } from '../ViewletAction/ViewletAction.ts'

export const getActions = (): readonly ViewletAction[] => {
  return [
    {
      type: ActionType.Button,
      id: ViewletExplorerStrings.newFile(),
      icon: MaskIcon.NewFile,
      command: 'newFile',
    },
    {
      type: ActionType.Button,
      id: ViewletExplorerStrings.newFolder(),
      icon: MaskIcon.NewFolder,
      command: 'newFolder',
    },
    {
      type: ActionType.Button,
      id: ViewletExplorerStrings.refresh(),
      icon: MaskIcon.Refresh,
      command: 'refresh',
    },
    {
      type: ActionType.Button,
      id: ViewletExplorerStrings.collapseAll(),
      icon: MaskIcon.CollapseAll,
      command: 'collapseAll',
    },
  ]
}
