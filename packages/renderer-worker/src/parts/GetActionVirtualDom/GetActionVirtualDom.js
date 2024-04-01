import * as ActionType from '../ActionType/ActionType.js'
import * as GetActionButtonVirtualDom from '../GetActionButtonVirtualDom/GetActionButtonVirtualDom.js'
import * as GetActionFilterVirtualDom from '../GetActionFilterVirtualDom/GetActionFilterVirtualDom.js'
import * as GetActionSelectVirtualDom from '../GetActionSelectVirtualDom/GetActionSelectVirtualDom.js'

export const getActionVirtualDom = (action) => {
  switch (action.type) {
    case ActionType.Button:
      return GetActionButtonVirtualDom.getActionButtonVirtualDom(action)
    case ActionType.Select:
      return GetActionSelectVirtualDom.getActionSelectVirtualDom(action)
    case ActionType.Filter:
      return GetActionFilterVirtualDom.getActionFilterVirtualDom(action)
    default:
      return []
  }
}
