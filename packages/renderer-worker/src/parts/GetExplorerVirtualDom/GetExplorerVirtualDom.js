import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as GetTreeItemIndent from '../GetTreeItemIndent/GetTreeItemIndent.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getItemVirtualDom = (item) => {
  const { posInSet, setSize, icon, name, path, depth } = item
  return [
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
    {
      type: VirtualDomElements.Div,
      className: `FileIcon FileIcon${icon}`,
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: 'Label',
      childCount: 1,
    },
    text(name),
  ]
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
  for (const item of visibleItems) {
    dom.push(...getItemVirtualDom(item))
  }
  return dom
}
