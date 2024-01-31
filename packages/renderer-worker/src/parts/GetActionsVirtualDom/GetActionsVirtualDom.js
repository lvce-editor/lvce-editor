import * as ActionType from '../ActionType/ActionType.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetActionButtonVirtualDom from '../GetActionButtonVirtualDom/GetActionButtonVirtualDom.js'
import * as GetActionFilterVirtualDom from '../GetActionFilterVirtualDom/GetActionFilterVirtualDom.js'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as GetActionSelectVirtualDom from '../GetActionSelectVirtualDom/GetActionSelectVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

const getActionVirtualDom = (action) => {
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

export const getActionsVirtualDom = (actions) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.Actions,
      role: AriaRoles.ToolBar,
      childCount: actions.length,
    },
    ...actions.flatMap(getActionVirtualDom),
  ]
}
