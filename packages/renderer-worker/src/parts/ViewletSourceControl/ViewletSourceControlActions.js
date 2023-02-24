import * as ActionType from '../ActionType/ActionType.js'

export const getActions = () => {
  return [
    {
      type: ActionType.Button,
      id: 'View as tree',
    },
    {
      type: ActionType.Button,
      id: 'Create Pull request',
    },
    {
      type: ActionType.Button,
      id: 'Commit and push',
    },
    {
      type: ActionType.Button,
      id: 'refresh',
    },
  ]
}
