import * as ActionType from '../ActionType/ActionType.js'

/**
 * @enum {string}
 */
const UiStrings = {
  Refresh: 'Refresh',
  ClearSearchResults: 'Clear Search Results',
  NewSearchEditor: 'New Search Editor',
  ViewAsTree: 'View as Tree',
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
      id: UiStrings.ClearSearchResults,
      icon: 'ClearAll',
      command: 'clearSearchResults',
    },
    {
      type: ActionType.Button,
      id: UiStrings.NewSearchEditor,
      icon: 'NewFile',
    },
    {
      type: ActionType.Button,
      id: UiStrings.ViewAsTree,
      icon: 'ListFlat',
    },
    {
      type: ActionType.Button,
      id: UiStrings.CollapseAll,
      icon: 'CollapseAll',
    },
  ]
}
