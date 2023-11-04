import * as ActionType from '../ActionType/ActionType.js'

export const getActions = () => {
  return [
    {
      type: ActionType.Filter,
      id: '',
    },
    {
      type: ActionType.Button,
      id: 'Clear Console',
      icon: 'ClearAll',
    },
  ]
}
