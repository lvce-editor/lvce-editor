import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as GetSourceControlItemsVirtualDom from '../GetSourceControlItemsVirtualDom/GetSourceControlItemsVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getSourceControlVirtualDom = (items, splitButtonEnabled) => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet SourceControl',
      tabIndex: 0,
      onClick: DomEventListenerFunctions.HandleClick,
      onContextMenu: DomEventListenerFunctions.HandleContextMenu,
      onMouseOver: DomEventListenerFunctions.HandleMouseOver,
      onMouseOut: DomEventListenerFunctions.HandleMouseOut,
      onWheel: DomEventListenerFunctions.HandleWheel,
      childCount: splitButtonEnabled ? 3 : 2,
    },
    ...GetSourceControlItemsVirtualDom.getSourceControlItemsVirtualDom(items, splitButtonEnabled),
  ]
  return dom
}
