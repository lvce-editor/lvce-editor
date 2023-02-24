import * as ActionType from '../ActionType/ActionType.js'

export const getActions = () => {
  return [
    {
      type: ActionType.Button,
      id: 'refresh',
    },
    {
      type: ActionType.Button,
      id: 'Clear search results',
    },
    {
      type: ActionType.Button,
      id: 'new search editor',
    },
    {
      type: ActionType.Button,
      id: 'view as tree',
    },
    {
      type: ActionType.Button,
      id: 'collapse all',
    },
  ]
}
