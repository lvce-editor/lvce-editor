import * as ActionType from '../ActionType/ActionType.js'

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
      icon: 'Refresh',
      command: 'refresh',
    },
    {
      type: ActionType.Button,
      id: UiStrings.Clear,
      icon: 'ClearAll',
      command: 'clear',
    },
    {
      type: ActionType.Button,
      id: UiStrings.CollapseAll,
      icon: 'CollapseAll',
      command: 'collapseAll',
    },
  ]
}
