import * as MaskIcon from '../MaskIcon/MaskIcon.js'
import * as ActionType from '../ActionType/ActionType.js'

export const getActions = () => {
  return [
    {
      type: ActionType.Filter,
      id: '',
      command: 'filter',
    },
    {
      type: ActionType.Button,
      id: 'Collapse All',
      command: 'collapseAll',
      icon: MaskIcon.CollapseAll,
    },
    {
      type: ActionType.Button,
      id: 'View as table',
      command: 'viewAsTable',
      icon: MaskIcon.ListFlat,
    },
  ]
}
