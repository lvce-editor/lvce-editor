import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as GetFileIconVirtualDom from '../GetFileIconVirtualDom/GetFileIconVirtualDom.js'
import * as GetTreeItemIndent from '../GetTreeItemIndent/GetTreeItemIndent.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getItemVirtualDom = (item) => {
  const { posInSet, setSize, icon, name, path, depth, type } = item
  const dom = [
    {
      type: VirtualDomElements.Div,
      role: AriaRoles.TreeItem,
      className: 'TreeItem',
      draggable: true,
      title: path,
      ariaPosInSet: posInSet,
      ariaSetSize: setSize,
      ariaLevel: depth,
      childCount: 2,
      paddingLeft: GetTreeItemIndent.getTreeItemIndent(depth),
      ariaLabel: name,
      ariaDescription: '',
    },
    GetFileIconVirtualDom.getFileIconVirtualDom(icon),
    {
      type: VirtualDomElements.Div,
      className: 'Label',
      childCount: 1,
    },
    text(name),
  ]
  switch (type) {
    // TODO decide on directory vs folder
    case DirentType.Directory:
      dom[0].ariaExpanded = 'false'
      break
    case DirentType.DirectoryExpanding:
      dom[0].ariaExpanded = 'true' // TODO tree should be aria-busy then
      break
    case DirentType.DirectoryExpanded:
      dom[0].ariaExpanded = 'true'
      break
    case DirentType.File:
      break
    default:
      break
  }
  return dom
}

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
  dom.push(...visibleItems.flatMap(getItemVirtualDom))
  return dom
}
