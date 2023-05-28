import * as ActionType from '../ActionType/ActionType.js'
import * as Icon from '../Icon/Icon.js'
import * as TerminalStrings from '../TerminalStrings/TerminalStrings.js'

export const getActions = (state) => {
  return [
    {
      type: ActionType.Button,
      id: TerminalStrings.newTerminal(),
      icon: Icon.Add,
      command: 'addTerminal',
    },
    {
      type: ActionType.Button,
      id: TerminalStrings.splitTerminal(),
      icon: Icon.SplitHorizontal,
      command: 'splitTerminal',
    },
    {
      type: ActionType.Button,
      id: TerminalStrings.killTerminal(),
      icon: Icon.Trash,
      command: 'killTerminal',
    },
  ]
}
