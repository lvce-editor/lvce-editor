import * as Icon from '../Icon/Icon.js'
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
      icon: Icon.CollapseAll,
    },
    {
      type: ActionType.Button,
      id: 'View as table',
      icon: Icon.ListFlat,
    },
  ]
}
