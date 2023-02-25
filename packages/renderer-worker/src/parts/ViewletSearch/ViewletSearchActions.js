import * as ActionType from '../ActionType/ActionType.js'
import * as Icon from '../Icon/Icon.js'

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
      icon: Icon.Refresh,
    },
    {
      type: ActionType.Button,
      id: UiStrings.ClearSearchResults,
      icon: Icon.ClearAll,
    },
    {
      type: ActionType.Button,
      id: UiStrings.NewSearchEditor,
      icon: Icon.NewFile,
    },
    {
      type: ActionType.Button,
      id: UiStrings.ViewAsTree,
      icon: Icon.ListFlat,
    },
    {
      type: ActionType.Button,
      id: UiStrings.CollapseAll,
      icon: Icon.CollapseAll,
    },
  ]
}
