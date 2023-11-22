import * as ActionType from '../ActionType/ActionType.js'
import * as MaskIcon from '../MaskIcon/MaskIcon.js'

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
      icon: MaskIcon.Refresh,
      command: 'refresh',
    },
    {
      type: ActionType.Button,
      id: UiStrings.ClearSearchResults,
      icon: MaskIcon.ClearAll,
      command: 'clearSearchResults',
    },
    {
      type: ActionType.Button,
      id: UiStrings.NewSearchEditor,
      icon: MaskIcon.NewFile,
    },
    {
      type: ActionType.Button,
      id: UiStrings.ViewAsTree,
      icon: MaskIcon.ListFlat,
    },
    {
      type: ActionType.Button,
      id: UiStrings.CollapseAll,
      icon: MaskIcon.CollapseAll,
    },
  ]
}
