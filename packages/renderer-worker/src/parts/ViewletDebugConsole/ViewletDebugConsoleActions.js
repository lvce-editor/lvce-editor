import * as ActionType from '../ActionType/ActionType.js'
import * as Icon from '../Icon/Icon.js'

export const getActions = () => {
  return [
    {
      type: ActionType.Filter,
      id: '',
    },
    {
      type: ActionType.Button,
      id: 'Clear Console',
      icon: Icon.ClearAll,
      command: 'clear',
    },
  ]
}
