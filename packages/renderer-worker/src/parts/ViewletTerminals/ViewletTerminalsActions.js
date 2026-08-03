import * as ActionType from '../ActionType/ActionType.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as Icon from '../Icon/Icon.js'
import * as TerminalStrings from '../TerminalStrings/TerminalStrings.js'

export const getActions = (state) => {
  return [
    {
      type: ActionType.Button,
      id: TerminalStrings.newTerminal(),
      icon: Icon.Add,
      command: 'addTerminal',
      onClick: DomEventListenerFunctions.HandleClickAction,
    },
    {
      type: ActionType.Button,
      id: TerminalStrings.splitTerminal(),
      icon: Icon.SplitHorizontal,
      command: 'splitTerminal',
      onClick: DomEventListenerFunctions.HandleClickAction,
    },
    {
      type: ActionType.Button,
      id: TerminalStrings.killTerminal(),
      icon: Icon.Trash,
      command: 'killTerminal',
      onClick: DomEventListenerFunctions.HandleClickAction,
    },
  ]
}
