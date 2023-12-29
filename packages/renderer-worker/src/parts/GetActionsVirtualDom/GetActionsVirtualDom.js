import * as ActionType from '../ActionType/ActionType.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

const getActionButtonVirtualDom = (action) => {
  const { id, icon, command } = action
  return [
    {
      type: VirtualDomElements.Button,
      className: 'IconButton',
      title: id,
      'data-command': command,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: `MaskIcon MaskIcon${icon}`,
      role: 'none',
      childCount: 0,
    },
  ]
}

const getActionVirtualDom = (action) => {
  switch (action.type) {
    case ActionType.Button:
      return getActionButtonVirtualDom(action)
    default:
      return []
  }
}

export const getActionsVirtualDom = (actions) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'Actions',
      childCount: actions.length,
    },
    ...actions.flatMap(getActionVirtualDom),
  ]
}
