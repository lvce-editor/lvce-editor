import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as GetTitleBarMenubarItemsVirtualDom from '../GetTitleBarMenuBarItemsVirtualDom/GetTitleBarMenuBarItemsVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getTitleBarMenuBarVirtualDom = (visibleItems) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet TitleBarMenuBar',
      role: AriaRoles.MenuBar,
      tabIndex: 0,
      childCount: visibleItems.length,
      onMouseDown: DomEventListenerFunctions.HandleClick,
      onFocusOut: DomEventListenerFunctions.HandleFocusOut,
      onFocusIn: DomEventListenerFunctions.HandleFocusIn,
      onPointerOver: DomEventListenerFunctions.HandlePointerOver,
      onPointerOut: DomEventListenerFunctions.HandlePointerOut,
    },
    ...GetTitleBarMenubarItemsVirtualDom.getTitleBarMenuBarItemsVirtualDom(visibleItems),
  ]
}
