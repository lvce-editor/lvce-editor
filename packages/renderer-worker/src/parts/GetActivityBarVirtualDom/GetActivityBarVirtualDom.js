import * as GetActivityBarItemsVirtualDom from '../GetActivityBarItemsVirtualDom/GetActivityBarItemsVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getActivityBarVirtualDom = (visibleItems) => {
  return [
    {
      type: VirtualDomElements.Div,
      id: 'ActivityBar',
      className: 'Viewlet ActivityBar',
      role: 'toolbar',
      ariaRoleDescription: 'Activity Bar',
      ariaOrientation: 'vertical',
      tabIndex: 0,
      onMouseDown: 'handleMouseDown',
      onContextMenu: 'handleContextMenu',
      onFocus: 'handleFocus',
      onBlur: 'handleBlur',
    },
    ...GetActivityBarItemsVirtualDom.getVirtualDom(visibleItems),
  ]
}
