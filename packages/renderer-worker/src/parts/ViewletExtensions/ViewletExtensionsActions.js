import * as ActionType from '../ActionType/ActionType.js'
import * as MaskIcon from '../MaskIcon/MaskIcon.js'

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
      icon: MaskIcon.Filter,
    },
    {
      type: ActionType.Button,
      id: UiStrings.Refresh,
      icon: MaskIcon.Refresh,
    },
    {
      type: ActionType.Button,
      id: UiStrings.ClearExtensionSearchResults,
      icon: MaskIcon.ClearAll,
      command: 'Extensions.clearSearchResults',
    },
  ]
}
