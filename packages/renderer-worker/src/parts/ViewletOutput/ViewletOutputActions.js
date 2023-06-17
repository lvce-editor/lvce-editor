import * as ActionType from '../ActionType/ActionType.js'
import * as Icon from '../Icon/Icon.js'

/**
 * @enum {string}
 */
const UiStrings = {
  Output: 'output',
  ClearOutput: 'clear output',
  TurnOffAutoScroll: 'Turn auto scrolling off',
  OpenLogFile: 'open output log file',
}

const toSelectOption = (option) => {
  return option.name
}

const toSelectOptions = (options) => {
  return options.map(toSelectOption)
}

export const getActions = (state) => {
  const { options } = state
  return [
    {
      type: ActionType.Select,
      id: UiStrings.Output,
      options: toSelectOptions(options),
    },
    {
      type: ActionType.Button,
      id: UiStrings.ClearOutput,
      icon: Icon.ClearAll,
    },
    {
      type: ActionType.Button,
      id: UiStrings.TurnOffAutoScroll,
      icon: Icon.Blank,
    },
    {
      type: ActionType.Button,
      id: UiStrings.OpenLogFile,
      icon: Icon.Blank,
    },
  ]
}
