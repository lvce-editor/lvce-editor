import * as ActionType from '../ActionType/ActionType.js'
import * as Icon from '../Icon/Icon.js'

/**
 * @enum {string}
 */
const UiStrings = {
  SplitTerminal: 'Split Terminal',
  KillTerminal: 'Kill Terminal',
}

export const getActions = (state) => {
  return [
    {
      type: ActionType.Button,
      id: UiStrings.SplitTerminal,
      icon: Icon.SplitHorizontal,
    },
    {
      type: ActionType.Button,
      id: UiStrings.KillTerminal,
      icon: Icon.Trash,
    },
  ]
}
