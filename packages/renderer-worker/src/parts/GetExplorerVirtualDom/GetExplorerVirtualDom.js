import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as GetExplorerItemVirtualDom from '../GetExplorerItemVirtualDom/GetExplorerItemVirtualDom.js'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.js'
import * as ExplorerStrings from '../ViewletExplorer/ViewletExplorerStrings.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getExplorerVirtualDom = (visibleItems, focusedIndex, root) => {
  if (!root) {
    return [
      {
        type: VirtualDomElements.Div,
        className: MergeClassNames.mergeClassNames(ClassNames.Viewlet, ClassNames.Explorer),
        tabIndex: 0,
        childCount: 2,
      },
      text(ExplorerStrings.youHaveNotYetOpenedAFolder()),
      {
        type: VirtualDomElements.Button,
        className: 'Button',
        childCount: 1,
      },
      text(ExplorerStrings.openFolder()),
    ]
  }
  const dom = []
  dom.push({
    type: VirtualDomElements.Div,
    className: MergeClassNames.mergeClassNames(ClassNames.Viewlet, ClassNames.Explorer),
    tabIndex: 0,
    role: AriaRoles.Tree,
    ariaLabel: ExplorerStrings.filesExplorer(),
    childCount: visibleItems.length,
    ariaActiveDescendant: focusedIndex >= 0 ? 'TreeItemActive' : undefined,
    onFocus: DomEventListenerFunctions.HandleFocus,
    onBlur: DomEventListenerFunctions.HandleBlur,
    onContextMenu: DomEventListenerFunctions.HandleContextMenu,
    onPointerDown: DomEventListenerFunctions.HandlePointerDown,
    onWheel: DomEventListenerFunctions.HandleWheel,
  })
  dom.push(...visibleItems.flatMap(GetExplorerItemVirtualDom.getExplorerItemVirtualDom))
  return dom
}
