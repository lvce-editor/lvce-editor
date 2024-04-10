import * as GetActivityBarItemsVirtualDom from '../GetActivityBarItemsVirtualDom/GetActivityBarItemsVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as AriaOrientationType from '../AriaOrientationType/AriaOrientationType.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'

export const getActivityBarVirtualDom = (visibleItems) => {
  return [
    {
      type: VirtualDomElements.Div,
      id: 'ActivityBar',
      className: 'Viewlet ActivityBar',
      role: AriaRoles.ToolBar,
      ariaRoleDescription: 'Activity Bar',
      ariaOrientation: AriaOrientationType.Vertical,
      tabIndex: 0,
      onMouseDown: 'handleMouseDown',
      onContextMenu: 'handleContextMenu',
      onFocus: 'handleFocus',
      onBlur: 'handleBlur',
      childCount: visibleItems.length,
    },
    ...GetActivityBarItemsVirtualDom.getVirtualDom(visibleItems),
  ]
}
