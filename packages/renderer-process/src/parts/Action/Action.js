import * as ActionButton from '../ActionButton/ActionButton.js'
import * as ActionDefault from '../ActionDefault/ActionDefault.js'
import * as ActionFilter from '../ActionFilter/ActionFilter.js'
import * as ActionSelect from '../ActionSelect/ActionSelect.js'

const getActionFunction = (type) => {
  switch (type) {
    case 'button':
      return ActionButton.create
    case 'filter':
      return ActionFilter.create
    case 'select':
      return ActionSelect.create
    default:
      console.warn(`action type not implemented: ${type}`)
      return ActionDefault.create
  }
}

export const create = (action) => {
  const fn = getActionFunction(action.type)
  const $Element = fn(action)
  return $Element
}
