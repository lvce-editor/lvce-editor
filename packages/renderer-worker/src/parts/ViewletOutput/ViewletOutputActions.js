import * as Icon from '../Icon/Icon.js'

import * as ActionType from '../ActionType/ActionType.js'

export const getActions = () => {
  return [
    {
      type: ActionType.Select,
      id: 'output',
    },
    {
      type: ActionType.Button,
      id: 'clear output',
      icon: Icon.ClearAll,
    },
    {
      type: ActionType.Button,
      id: 'Turn auto scrolling off',
      icon: Icon.Blank,
    },
    {
      type: ActionType.Button,
      id: 'open output log file',
      icon: Icon.Blank,
    },
  ]
}
