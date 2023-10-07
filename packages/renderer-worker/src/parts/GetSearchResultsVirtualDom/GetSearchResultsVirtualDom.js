import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as GetFileIconVirtualDom from '../GetFileIconVirtualDom/GetFileIconVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const deleted = {
  type: VirtualDomElements.Del,
  className: 'HighlightDeleted',
  childCount: 1,
}

const inserted = {
  type: VirtualDomElements.Ins,
  className: 'HighlightInserted',
  childCount: 1,
}

const highlighted = {
  type: VirtualDomElements.Span,
  className: 'Highlight',
  childCount: 1,
}

const renderRow = (rowInfo) => {
  const { top, type, matchStart, matchLength, text: displayText, title, icon, setSize, posInSet, depth, replacement } = rowInfo
  const treeItem = {
    type: VirtualDomElements.Div,
    role: AriaRoles.TreeItem,
    className: 'TreeItem',
    title,
    ariaSetSize: setSize,
    ariaLevel: depth,
    ariaPosInSet: posInSet,
    ariaLabel: name,
    ariaDescription: '',
    childCount: 1,
    paddingLeft: `${depth * 1 + 1}rem`,
  }
  switch (type) {
    case DirentType.Directory:
      treeItem.ariaExpanded = 'false'
      break
    case DirentType.DirectoryExpanded:
      treeItem.ariaExpanded = 'true'
      break
    case DirentType.File:
      break
    default:
      break
  }
  const dom = []

  dom.push(treeItem)
  treeItem.childCount++
  dom.push(GetFileIconVirtualDom.getFileIconVirtualDom(icon))
  const label = {
    type: VirtualDomElements.Div,
    className: 'Label',
    childCount: 1,
  }
  dom.push(label)
  if (matchLength) {
    const before = displayText.slice(0, matchStart)
    const highlight = displayText.slice(matchStart, matchStart + matchLength)
    const after = displayText.slice(matchStart + matchLength)
    if (replacement) {
      dom.push(text(before), deleted, text(highlight), inserted, text(replacement), text(after))
      label.childCount = 4
    } else {
      label.childCount = 3
      dom.push(text(before), highlighted, text(highlight), text(after))
    }
  } else {
    dom.push(text(displayText))
  }
  return dom
}

export const getSearchResultsVirtualDom = (visibleItems) => {
  const dom = [...visibleItems.flatMap(renderRow)]
  return dom
}
