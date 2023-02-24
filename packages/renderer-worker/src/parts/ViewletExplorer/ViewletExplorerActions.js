import * as ActionType from '../ActionType/ActionType.js'

export const getActions = () => {
  return [
    {
      type: ActionType.Button,
      id: 'new File',
    },
    {
      type: ActionType.Button,
      id: 'new Folder',
    },
    {
      type: ActionType.Button,
      id: 'refresh',
    },
    {
      type: ActionType.Button,
      id: 'Collapse all',
    },
  ]
}
