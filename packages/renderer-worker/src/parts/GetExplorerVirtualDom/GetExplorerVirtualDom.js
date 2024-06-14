import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetExplorerItemVirtualDom from '../GetExplorerItemVirtualDom/GetExplorerItemVirtualDom.js'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.js'
import * as ExplorerStrings from '../ViewletExplorer/ViewletExplorerStrings.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getExplorerVirtualDom = (visibleItems) => {
  const dom = []
  dom.push({
    type: VirtualDomElements.Div,
    className: MergeClassNames.mergeClassNames(ClassNames.Viewlet, ClassNames.Explorer),
    tabIndex: 0,
    role: AriaRoles.Tree,
    ariaLabel: ExplorerStrings.filesExplorer(),
    childCount: visibleItems.length,
  })
  dom.push(...visibleItems.flatMap(GetExplorerItemVirtualDom.getExplorerItemVirtualDom))
  return dom
}
