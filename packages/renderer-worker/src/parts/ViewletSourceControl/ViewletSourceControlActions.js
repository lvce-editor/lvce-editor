import * as ActionType from '../ActionType/ActionType.js'
import * as Icon from '../Icon/Icon.js'

export const getActions = () => {
  return [
    {
      type: ActionType.Button,
      id: 'View as tree',
      icon: Icon.ListFlat,
    },
    {
      type: ActionType.Button,
      id: 'Create Pull request',
      icon: Icon.Files,
    },
    {
      type: ActionType.Button,
      id: 'Commit and push',
      icon: Icon.Files,
    },
    {
      type: ActionType.Button,
      id: 'refresh',
      icon: Icon.Refresh,
    },
  ]
}
