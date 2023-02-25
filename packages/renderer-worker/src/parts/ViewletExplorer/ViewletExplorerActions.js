import * as ActionType from '../ActionType/ActionType.js'
import * as Icon from '../Icon/Icon.js'

export const getActions = () => {
  return [
    {
      type: ActionType.Button,
      id: 'new File',
      icon: Icon.Files,
    },
    {
      type: ActionType.Button,
      id: 'new Folder',
      icon: Icon.Files,
    },
    {
      type: ActionType.Button,
      id: 'refresh',
      icon: Icon.Files,
    },
    {
      type: ActionType.Button,
      id: 'Collapse all',
      icon: Icon.CollapseAll,
    },
  ]
}
