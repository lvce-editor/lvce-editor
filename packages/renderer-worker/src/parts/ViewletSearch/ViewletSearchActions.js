import * as ActionType from '../ActionType/ActionType.js'
import * as Icon from '../Icon/Icon.js'

export const getActions = () => {
  return [
    {
      type: ActionType.Button,
      id: 'refresh',
      icon: Icon.Files,
    },
    {
      type: ActionType.Button,
      id: 'Clear search results',
      icon: Icon.ClearAll,
    },
    {
      type: ActionType.Button,
      id: 'new search editor',
      icon: Icon.Files,
    },
    {
      type: ActionType.Button,
      id: 'view as tree',
      icon: Icon.ListFlat,
    },
    {
      type: ActionType.Button,
      id: 'collapse all',
      icon: Icon.CollapseAll,
    },
  ]
}
