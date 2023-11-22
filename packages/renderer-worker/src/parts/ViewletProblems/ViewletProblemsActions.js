import * as MaskIcon from '../MaskIcon/MaskIcon.js'
import * as ActionType from '../ActionType/ActionType.js'

export const getActions = () => {
  return [
    {
      type: ActionType.Filter,
      id: '',
    },
    {
      type: ActionType.Button,
      id: 'Collapse All',
      icon: MaskIcon.CollapseAll,
    },
    {
      type: ActionType.Button,
      id: 'View as table',
      icon: MaskIcon.ListFlat,
    },
  ]
}
