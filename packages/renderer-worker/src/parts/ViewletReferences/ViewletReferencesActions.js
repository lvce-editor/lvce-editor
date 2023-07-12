import * as ActionType from '../ActionType/ActionType.js'
import * as Icon from '../Icon/Icon.js'

/**
 * @enum {string}
 */
const UiStrings = {
  Refresh: 'Refresh',
  Clear: 'Clear',
  CollapseAll: 'Collapse All',
}

export const getActions = () => {
  return [
    {
      type: ActionType.Button,
      id: UiStrings.Refresh,
      icon: Icon.Refresh,
      command: 'refresh',
    },
    {
      type: ActionType.Button,
      id: UiStrings.Clear,
      icon: Icon.ClearAll,
      command: 'clear',
    },
    {
      type: ActionType.Button,
      id: UiStrings.CollapseAll,
      icon: Icon.CollapseAll,
      command: 'collapseAll',
    },
  ]
}
