import * as AriaRoles from '../AriaRoles/AriaRoles.js'
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
      onMouseDown: 'handleClick',
      onFocusOut: 'handleFocusOut',
      onFocusIn: 'handleFocusIn',
      onPointerOver: 'handlePointerOver',
      onPointerOut: 'handlePointerOut',
    },
    ...GetTitleBarMenubarItemsVirtualDom.getTitleBarMenuBarItemsVirtualDom(visibleItems),
  ]
}
