import * as ActionType from '../ActionType/ActionType.js'

/**
 * @enum {string}
 */
const UiStrings = {
  Filter: 'Filter',
  Refresh: 'Refresh',
  ClearExtensionSearchResults: 'Clear extension search results',
}

export const getActions = () => {
  return [
    {
      type: ActionType.Button,
      id: UiStrings.Filter,
      icon: 'Filter',
    },
    {
      type: ActionType.Button,
      id: UiStrings.Refresh,
      icon: 'Refresh',
    },
    {
      type: ActionType.Button,
      id: UiStrings.ClearExtensionSearchResults,
      icon: 'ClearAll',
      command: 'Extensions.clearSearchResults',
    },
  ]
}
