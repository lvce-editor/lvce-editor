import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

/**
 * @enum {string}
 */
const ClassNames = {
  KeyBindingsTableRow: 'KeyBindingsTableRow',
  KeyBindingsTableCell: 'KeyBindingsTableCell',
  Key: 'Key',
  KeyBindingsTable: 'KeyBindingsTable',
  KeyBindingsTableHead: 'KeyBindingsTableHead',
  KeyBindingsTableBody: 'KeyBindingsTableBody',
  KeyBindingsHeader: 'KeyBindingsHeader',
}

/**
 * @enum {string}
 */
const UiStrings = {
  KeyBindings: 'KeyBindings',
  Command: 'Command',
  When: 'When',
  Key: 'Key',
  EmptyString: '',
  SearchKeyBindings: 'Search Key Bindings',
}

const kbdDom = {
  type: VirtualDomElements.Kbd,
  className: ClassNames.Key,
  childCount: 1,
}

const textCtrl = text('Ctrl')
const textShift = text('Shift')
const textPlus = text('+')

// TODO needing childCount variable everywhere can be error prone
const getKeyBindingCellChildren = (keyBinding) => {
  const children = []
  let childCount = 0
  if (keyBinding.isCtrl) {
    childCount += 2
    children.push(kbdDom, textCtrl, textPlus)
  }
  if (keyBinding.isShift) {
    childCount += 2
    children.push(kbdDom, textShift, textPlus)
  }
  childCount++
  children.push(kbdDom, text(keyBinding.key))
  return { children, childCount }
}

const tableCellProps = {
  className: ClassNames.KeyBindingsTableCell,
}

const tableCell = {
  type: VirtualDomElements.Td,
  ...tableCellProps,
  childCount: 1,
}

const getRowClassName = (isEven, selected) => {
  let className = ''
  if (isEven) {
    className += 'KeyBindingsTableRowEven'
  } else {
    className += 'KeyBindingsTableRowOdd'
  }
  if (selected) {
    className += ' KeyBindingsTableRowSelected'
  }
  return className
}

const getTableRowDom = (keyBinding) => {
  const { children, childCount } = getKeyBindingCellChildren(keyBinding)
  const { rowIndex, selected } = keyBinding
  const isEven = rowIndex % 2 === 0
  const className = getRowClassName(isEven, selected)
  return [
    {
      type: VirtualDomElements.Tr,
      ariaRowIndex: keyBinding.rowIndex,
      className,
      key: keyBinding.rowIndex,
      childCount: 3,
    },
    tableCell,
    text(keyBinding.command),
    {
      type: VirtualDomElements.Td,
      ...tableCellProps,
      childCount,
    },
    ...children,
    tableCell,
    text(keyBinding.when || UiStrings.EmptyString),
  ]
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
  text(UiStrings.Command),
  tableHeading,
  text(UiStrings.Key),
  tableHeading,
  text(UiStrings.When),
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
      ariaLabel: UiStrings.KeyBindings,
      ariaRowCount: filteredKeyBindings.length,
      childCount: 3,
    },
    {
      type: VirtualDomElements.ColGroup,
      className: 'KeyBindingsTableColGroup',
      childCount: 3,
    },
    {
      type: VirtualDomElements.Col,
      className: 'KeyBindingsTableCol',
      width: columnWidth1,
      childCount: 0,
    },
    {
      type: VirtualDomElements.Col,
      className: 'KeyBindingsTableCol',
      width: columnWidth2,
      childCount: 0,
    },
    {
      type: VirtualDomElements.Col,
      className: 'KeyBindingsTableCol',
      width: columnWidth3,
      childCount: 0,
    },
    ...staticTableHeadDom,
    ...getTableBodyDom(displayKeyBindings),
  ]
  return tableDom
}
