import * as DirentType from '../DirentType/DirentType.js'
import { del, div, ins, root, span, text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const deleted = del(
  {
    className: 'HighlightDeleted',
  },
  1
)

const inserted = ins(
  {
    className: 'HighlightInserted',
  },
  1
)

const highlighted = span(
  {
    className: 'Highlight',
  },
  1
)

const renderRow = (rowInfo) => {
  const { top, type, matchStart, matchLength, text: displayText, title, icon, setSize, posInSet, depth, replacement } = rowInfo
  if (matchLength) {
  }
  const treeItem = div(
    {
      role: 'treeitem',
      className: 'TreeItem',
      title,
      ariaSetSize: setSize,
      ariaLevel: depth,
      ariaPosInSet: posInSet,
      ariaLabel: name,
      ariaDescription: '',
      top,
    },
    1
  )
  switch (type) {
    case DirentType.Directory:
      treeItem.props.ariaExpanded = 'false'
      break
    case DirentType.DirectoryExpanded:
      treeItem.props.ariaExpanded = 'true'
      break
    case DirentType.File:
      break
    default:
      break
  }
  const dom = [treeItem]

  if (icon) {
    treeItem.childCount++
    dom.push(
      div({
        className: `FileIcon FileIcon${icon}`,
      })
    )
  }
  const label = div(
    {
      className: 'Label',
    },
    1
  )
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
