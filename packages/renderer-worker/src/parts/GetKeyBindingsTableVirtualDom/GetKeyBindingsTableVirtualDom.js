import * as ClassNames from '../ClassNames/ClassNames.js'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.js'
import * as ViewletKeyBindingsStrings from '../ViewletKeyBindings/ViewletKeyBindingsStrings.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const kbdDom = {
  type: VirtualDomElements.Kbd,
  className: ClassNames.Key,
  childCount: 1,
}

const highlight = {
  type: VirtualDomElements.Span,
  className: ClassNames.SearchHighlight,
  childCount: 1,
}

const textCtrl = text('Ctrl')
const textShift = text('Shift')
const textPlus = text('+')

const addHighlights = (tableCell, dom, highlights, label) => {
  dom.push(tableCell)
  let position = 0
  for (let i = 0; i < highlights.length; i += 2) {
    const highlightStart = highlights[i]
    const highlightEnd = highlights[i + 1]
    if (position < highlightStart) {
      const beforeText = label.slice(position, highlightStart)
      tableCell.childCount++
      dom.push(text(beforeText))
    }
    const highlightText = label.slice(highlightStart, highlightEnd)
    tableCell.childCount++
    dom.push(highlight, text(highlightText))
    position = highlightEnd
  }
  if (position < label.length) {
    const afterText = label.slice(position)
    tableCell.childCount++
    dom.push(text(afterText))
  }
}

// TODO needing childCount variable everywhere can be error prone
const getKeyBindingCellChildren = (keyBinding) => {
  const { isCtrl, isShift, key, keyMatches, commandMatches } = keyBinding
  const children = []
  let childCount = 0
  if (isCtrl) {
    childCount += 2
    children.push(kbdDom, textCtrl, textPlus)
  }
  if (isShift) {
    childCount += 2
    children.push(kbdDom, textShift, textPlus)
  }
  childCount++
  children.push(kbdDom, text(key))
  return { children, childCount }
}

const tableCellProps = {
  className: ClassNames.KeyBindingsTableCell,
}

const getRowClassName = (isEven, selected) => {
  return MergeClassNames.mergeClassNames(
    ClassNames.KeyBindingsTableRow,
    isEven ? ClassNames.KeyBindingsTableRowEven : ClassNames.KeyBindingsTableRowOdd,
    selected ? ClassNames.KeyBindingsTableRowSelected : '',
  )
}

const getTableRowDom = (keyBinding) => {
  const { children, childCount } = getKeyBindingCellChildren(keyBinding)
  const { rowIndex, selected, commandMatches, command } = keyBinding
  const commandHighlights = commandMatches.slice(1)
  const isEven = rowIndex % 2 === 0
  const className = getRowClassName(isEven, selected)
  const dom = []
  dom.push({
    type: VirtualDomElements.Tr,
    ariaRowIndex: rowIndex,
    className,
    key: rowIndex,
    childCount: 3,
  })
  const tableCell = {
    type: VirtualDomElements.Td,
    ...tableCellProps,
    childCount: 0,
  }
  addHighlights(tableCell, dom, commandHighlights, command)
  dom.push(
    {
      type: VirtualDomElements.Td,
      ...tableCellProps,
      childCount,
    },
    ...children,
    {
      type: VirtualDomElements.Td,
      ...tableCellProps,
      childCount: 1,
    },
    text(keyBinding.when || ''),
  )
  return dom
}

const tableHead = {
  type: VirtualDomElements.THead,
  className: ClassNames.KeyBindingsTableHead,
  childCount: 1,
}

const tableHeadRow = {
  type: VirtualDomElements.Tr,
  className: ClassNames.KeyBindingsTableRow,
  ariaRowIndex: 1,
  childCount: 3,
}

const tableHeading = {
  type: VirtualDomElements.Th,
  ...tableCellProps,
  childCount: 1,
}

const staticTableHeadDom = [
  tableHead,
  tableHeadRow,
  tableHeading,
  text(ViewletKeyBindingsStrings.command()),
  tableHeading,
  text(ViewletKeyBindingsStrings.key()),
  tableHeading,
  text(ViewletKeyBindingsStrings.when()),
]

const getTableBodyDom = (displayKeyBindings) => {
  return [
    {
      type: VirtualDomElements.TBody,
      className: ClassNames.KeyBindingsTableBody,
      childCount: displayKeyBindings.length,
    },
    ...displayKeyBindings.flatMap(getTableRowDom),
  ]
}

export const getTableDom = (filteredKeyBindings, displayKeyBindings, columnWidth1, columnWidth2, columnWidth3) => {
  const tableDom = [
    {
      type: VirtualDomElements.Table,
      className: ClassNames.KeyBindingsTable,
      ariaLabel: ViewletKeyBindingsStrings.keyBindings(),
      ariaRowCount: filteredKeyBindings.length,
      onClick: 'handleTableClick',
      childCount: 3,
    },
    {
      type: VirtualDomElements.ColGroup,
      className: ClassNames.KeyBindingsTableColGroup,
      childCount: 3,
    },
    {
      type: VirtualDomElements.Col,
      className: ClassNames.KeyBindingsTableCol,
      width: columnWidth1,
      childCount: 0,
    },
    {
      type: VirtualDomElements.Col,
      className: ClassNames.KeyBindingsTableCol,
      width: columnWidth2,
      childCount: 0,
    },
    {
      type: VirtualDomElements.Col,
      className: ClassNames.KeyBindingsTableCol,
      width: columnWidth3,
      childCount: 0,
    },
    ...staticTableHeadDom,
    ...getTableBodyDom(displayKeyBindings),
  ]
  return tableDom
}
