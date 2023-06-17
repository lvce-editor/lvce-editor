import { div, text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getItemVirtualDom = (item) => {
  const { posInSet, setSize, title, level, icon, label } = item
  return [
    div(
      {
        role: 'treeitem',
        className: 'TreeItem',
        draggable: true,
        title,
        ariaPosInset: posInSet,
        ariaSetSize: setSize,
        ariaLevel: level,
      },
      2
    ),
    div(
      {
        className: `FileIcon FileIcon${icon}`,
      },
      0
    ),
    div(
      {
        className: 'Label',
      },
      1
    ),
    text(label),
  ]
}

export const getExplorerVirtualDom = (visibleItems) => {
  const dom = []
  dom.push(
    div(
      {
        className: 'Viewlet Explorer',
        tabIndex: 0,
        role: 'tree',
        ariaLabel: 'Files Explorer',
      },
      visibleItems.length
    )
  )
  for (const item of visibleItems) {
    dom.push(...getItemVirtualDom(item))
  }
  return dom
}
