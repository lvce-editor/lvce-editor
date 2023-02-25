import * as ActionType from '../ActionType/ActionType.js'
import * as Icon from '../Icon/Icon.js'

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
      icon: Icon.Files,
    },
    {
      type: ActionType.Button,
      id: UiStrings.Refresh,
      icon: Icon.Files,
    },
    {
      type: ActionType.Button,
      id: UiStrings.ClearExtensionSearchResults,
      icon: Icon.ClearAll,
    },
  ]
}
