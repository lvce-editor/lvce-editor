import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as GetExtensionsListItemVirtualDom from '../GetExtensionsListItemVirtualDom/GetExtensionsListItemVirtualDom.js'
import * as ExtensionStrings from '../ViewletExtensions/ViewletExtensionsStrings.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getExtensionsListVirtualDom = (visibleExtensions) => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ListItems,
      tabIndex: 0,
      ariaLabel: ExtensionStrings.extensions(),
      role: AriaRoles.List,
      oncontextmenu: DomEventListenerFunctions.HandleContextMenu,
      onpointerdown: DomEventListenerFunctions.HandlePointerDown,
      ontouchstart: DomEventListenerFunctions.HandleTouchStart,
      onwheelpassive: DomEventListenerFunctions.HandleWheel,
      childCount: visibleExtensions.length,
    },
    ...visibleExtensions.flatMap(GetExtensionsListItemVirtualDom.getExtensionListItemVirtualDom),
  ]
  return dom
}
