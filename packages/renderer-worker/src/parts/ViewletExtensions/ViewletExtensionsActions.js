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
    },
    {
      type: ActionType.Button,
      id: UiStrings.Refresh,
    },
    {
      type: ActionType.Button,
      id: UiStrings.ClearExtensionSearchResults,
    },
  ]
}
