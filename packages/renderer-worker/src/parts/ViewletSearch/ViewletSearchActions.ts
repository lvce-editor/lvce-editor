import * as ActionType from '../ActionType/ActionType.js'
import * as MaskIcon from '../MaskIcon/MaskIcon.js'
import * as ViewletSearchStrings from './ViewletSearchStrings.ts'

export const getActions = () => {
  return [
    {
      type: ActionType.Button,
      id: ViewletSearchStrings.refresh(),
      icon: MaskIcon.Refresh,
      command: 'refresh',
    },
    {
      type: ActionType.Button,
      id: ViewletSearchStrings.clearSearchResults(),
      icon: MaskIcon.ClearAll,
      command: 'clearSearchResults',
    },
    {
      type: ActionType.Button,
      id: ViewletSearchStrings.openNewSearchEditor(),
      icon: MaskIcon.NewFile,
    },
    {
      type: ActionType.Button,
      id: ViewletSearchStrings.viewAsTree(),
      icon: MaskIcon.ListFlat,
    },
    {
      type: ActionType.Button,
      id: ViewletSearchStrings.collapseAll(),
      icon: MaskIcon.CollapseAll,
    },
  ]
}
