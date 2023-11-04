import * as ActionType from '../ActionType/ActionType.js'

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
      icon: 'ClearAll',
    },
    {
      type: ActionType.Button,
      id: UiStrings.TurnOffAutoScroll,
      icon: 'Blank',
    },
    {
      type: ActionType.Button,
      id: UiStrings.OpenLogFile,
      icon: 'Blank',
    },
  ]
}
