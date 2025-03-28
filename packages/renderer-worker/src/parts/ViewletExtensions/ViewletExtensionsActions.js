import * as ActionType from '../ActionType/ActionType.js'
import * as MaskIcon from '../MaskIcon/MaskIcon.js'

export const getActions = () => {
  return [
    {
      type: ActionType.Button,
      id: 'refresh',
      icon: MaskIcon.Refresh,
    },
    {
      type: ActionType.Button,
      id: 'more actions',
      icon: 'Ellipsis',
    },
  ]
}
