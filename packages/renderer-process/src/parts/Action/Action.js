import * as ActionButton from '../ActionButton/ActionButton.js'
import * as ActionDefault from '../ActionDefault/ActionDefault.js'
import * as ActionFilter from '../ActionFilter/ActionFilter.js'
import * as ActionSelect from '../ActionSelect/ActionSelect.js'
import * as ActionType from '../ActionType/ActionType.js'
import * as Logger from '../Logger/Logger.js'

const getActionFunction = (type) => {
  switch (type) {
    case ActionType.Button:
      return ActionButton.create
    case ActionType.Filter:
      return ActionFilter.create
    case ActionType.Select:
      return ActionSelect.create
    default:
      Logger.warn(`action type not implemented: ${type}`)
      return ActionDefault.create
  }
}

export const create = (action) => {
  const fn = getActionFunction(action.type)
  const $Element = fn(action)
  return $Element
}
