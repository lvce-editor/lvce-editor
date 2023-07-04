import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getItemVirtualDom = (item) => {
  const { posInSet, setSize, title, level, icon, label } = item
  return [
    {
      type: VirtualDomElements.Div,
      role: 'treeitem',
      className: 'TreeItem',
      draggable: true,
      title,
      ariaPosInset: posInSet,
      ariaSetSize: setSize,
      ariaLevel: level,
      childCount: 2,
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
    text(label),
  ]
}

export const getExplorerVirtualDom = (visibleItems) => {
  const dom = []
  dom.push({
    type: VirtualDomElements.Div,
    className: 'Viewlet Explorer',
    tabIndex: 0,
    role: 'tree',
    ariaLabel: 'Files Explorer',
    childCount: visibleItems.length,
  })
  for (const item of visibleItems) {
    dom.push(...getItemVirtualDom(item))
  }
  return dom
}
