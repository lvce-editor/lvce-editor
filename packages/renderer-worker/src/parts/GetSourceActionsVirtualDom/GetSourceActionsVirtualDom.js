import * as GetSourceActionListItemVirtualDom from '../GetSourceActionListItemVirtualDom/GetSourceActionListItemVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getSourceActionsVirtualDom = (sourceActions) => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet EditorSourceActions',
      tabIndex: -1,
      childCount: sourceActions.length,
      onFocusIn: 'handleFocusIn',
    },
    ...sourceActions.flatMap(GetSourceActionListItemVirtualDom.getSourceActionListItemVirtualDom),
  ]
  return dom
}
