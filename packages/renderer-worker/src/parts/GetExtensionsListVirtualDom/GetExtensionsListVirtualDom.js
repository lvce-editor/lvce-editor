import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetExtensionsListItemVirtualDom from '../GetExtensionsListItemVirtualDom/GetExtensionsListItemVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getExtensionsListVirtualDom = (visibleExtensions) => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ListItems,
      tabIndex: 0,
      ariaLabel: 'Extensions',
      role: AriaRoles.List,
      onwheelpassive: 'handleWheel',
      oncontextmenu: 'handleContextMenu',
      onpointerdown: 'handlePointerDown',
      ontouchstart: 'handleTouchStart',
      childCount: visibleExtensions.length,
    },
    ...visibleExtensions.flatMap(GetExtensionsListItemVirtualDom.getExtensionListItemVirtualDom),
  ]
  return dom
}
