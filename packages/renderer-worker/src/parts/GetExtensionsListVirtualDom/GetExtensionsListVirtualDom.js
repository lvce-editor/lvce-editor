import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetExtensionsListItemVirtualDom from '../GetExtensionsListItemVirtualDom/GetExtensionsListItemVirtualDom.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getExtensionsListVirtualDom = (visibleExtensions) => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ListItems,
      tabIndex: 0,
      ariaLabel: 'Extensions',
      role: AriaRoles.List,
      onWheel: 'handleWheel',
      onScroll: 'handleScroll',
      onFocus: 'handleFocus',
      onContextMenu: 'handleContextMenu',
      onPointerDown: 'handlePointerDown',
      onTouchStart: 'handleTouchStart',
      onTouchMove: 'handleTouchStart',
      onTouchEnd: 'handleTouchStart',
      childCount: visibleExtensions.length,
    },
    ...visibleExtensions.flatMap(GetExtensionsListItemVirtualDom.getExtensionListItemVirtualDom),
  ]
  return dom
}
