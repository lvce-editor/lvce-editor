import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as GetFileIconVirtualDom from '../GetFileIconVirtualDom/GetFileIconVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const deleted = {
  type: VirtualDomElements.Del,
  className: ClassNames.HighlightDeleted,
  childCount: 1,
}

const inserted = {
  type: VirtualDomElements.Ins,
  className: ClassNames.HighlightInserted,
  childCount: 1,
}

const highlighted = {
  type: VirtualDomElements.Span,
  className: ClassNames.Highlight,
  childCount: 1,
}

const renderRow = (rowInfo) => {
  const { top, type, matchStart, matchLength, text: displayText, title, icon, setSize, posInSet, depth, replacement } = rowInfo
  const treeItem = {
    type: VirtualDomElements.Div,
    role: AriaRoles.TreeItem,
    className: ClassNames.TreeItem,
    title,
    ariaSetSize: setSize,
    ariaLevel: depth,
    ariaPosInSet: posInSet,
    ariaLabel: title,
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
  if (icon) {
    treeItem.childCount++
    dom.push(GetFileIconVirtualDom.getFileIconVirtualDom(icon))
  }
  const label = {
    type: VirtualDomElements.Div,
    className: ClassNames.Label,
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
  return visibleItems.flatMap(renderRow)
}
