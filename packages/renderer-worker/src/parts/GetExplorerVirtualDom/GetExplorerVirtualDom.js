import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as GetExplorerItemVirtualDom from '../GetExplorerItemVirtualDom/GetExplorerItemVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getExplorerVirtualDom = (visibleItems) => {
  const dom = []
  dom.push({
    type: VirtualDomElements.Div,
    className: 'Viewlet Explorer',
    tabIndex: 0,
    role: AriaRoles.Tree,
    ariaLabel: 'Files Explorer',
    childCount: visibleItems.length,
  })
  dom.push(...visibleItems.flatMap(GetExplorerItemVirtualDom.getExplorerItemVirtualDom))
  return dom
}
