import * as ActionType from '../ActionType/ActionType.js'
import * as TerminalStrings from '../TerminalStrings/TerminalStrings.js'

export const getActions = (state) => {
  return [
    {
      type: ActionType.Button,
      id: TerminalStrings.newTerminal(),
      icon: 'Add',
      command: 'addTerminal',
    },
    {
      type: ActionType.Button,
      id: TerminalStrings.splitTerminal(),
      icon: 'SplitHorizontal',
      command: 'splitTerminal',
    },
    {
      type: ActionType.Button,
      id: TerminalStrings.killTerminal(),
      icon: 'Trash',
      command: 'killTerminal',
    },
  ]
}
