import * as ActionType from '../ActionType/ActionType.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetIconVirtualDom from '../GetIconVirtualDom/GetIconVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

const getActionButtonVirtualDom = (action) => {
  const { id, icon, command } = action
  return [
    {
      type: VirtualDomElements.Button,
      className: ClassNames.IconButton,
      title: id,
      'data-command': command,
      childCount: 1,
    },
    GetIconVirtualDom.getIconVirtualDom(icon),
  ]
}

const getActionSelectVirtualDom = (action) => {
  return []
}

const getActionFilterVirtualDom = (action) => {
  return [
    {
      type: VirtualDomElements.Input,
      className: ClassNames.InputBox,
      childCount: 0,
      spellcheck: false,
      autocapitalize: 'off',
      autocorrect: 'off',
      placeholder: 'Filter',
    },
  ]
}

const getActionVirtualDom = (action) => {
  switch (action.type) {
    case ActionType.Button:
      return getActionButtonVirtualDom(action)
    case ActionType.Select:
      return getActionSelectVirtualDom(action)
    case ActionType.Filter:
      return getActionFilterVirtualDom(action)
    default:
      return []
  }
}

export const getActionsVirtualDom = (actions) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.Actions,
      childCount: actions.length,
    },
    ...actions.flatMap(getActionVirtualDom),
  ]
}
