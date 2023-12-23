import * as ActionType from '../ActionType/ActionType.js'
import * as ViewletOutputStrings from '../ViewletOutput/ViewletOutputStrings.js'

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
      id: ViewletOutputStrings.output(),
      options: toSelectOptions(options),
    },
    {
      type: ActionType.Button,
      id: ViewletOutputStrings.clearOutput(),
      icon: 'ClearAll',
    },
    {
      type: ActionType.Button,
      id: ViewletOutputStrings.turnOffAutoScroll(),
      icon: 'Blank',
    },
    {
      type: ActionType.Button,
      id: ViewletOutputStrings.openLogFile(),
      icon: 'Blank',
    },
  ]
}
