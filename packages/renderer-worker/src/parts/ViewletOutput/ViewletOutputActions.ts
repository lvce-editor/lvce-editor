import * as ActionType from '../ActionType/ActionType.js'
import * as Icon from '../Icon/Icon.js'
import * as ViewletOutputStrings from './ViewletOutputStrings.ts'

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
      icon: Icon.ClearAll,
    },
    {
      type: ActionType.Button,
      id: ViewletOutputStrings.turnOffAutoScroll(),
      icon: Icon.Blank,
    },
    {
      type: ActionType.Button,
      id: ViewletOutputStrings.openLogFile(),
      icon: Icon.Blank,
    },
  ]
}
