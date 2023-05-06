import { col, colgroup, kbd, table, tbody, td, text, th, thead, tr } from '../VirtualDomHelpers/VirtualDomHelpers.js'

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

const kbdDom = kbd(
  {
    className: ClassNames.Key,
  },
  1
)

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

const tableCell = td(tableCellProps, 1)

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
    tr(
      {
        ariaRowIndex: keyBinding.rowIndex,
        className,
        key: keyBinding.rowIndex,
      },
      3
    ),
    tableCell,
    text(keyBinding.command),
    td(tableCellProps, childCount),
    ...children,
    tableCell,
    text(keyBinding.when || UiStrings.EmptyString),
  ]
}

const tableHead = thead(
  {
    className: ClassNames.KeyBindingsTableHead,
  },
  1
)

const tableHeadRow = tr(
  {
    className: ClassNames.KeyBindingsTableRow,
    ariaRowIndex: 1,
  },
  3
)

const tableHeading = th(tableCellProps, 1)

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
    tbody(
      {
        className: ClassNames.KeyBindingsTableBody,
      },
      displayKeyBindings.length
    ),
    ...displayKeyBindings.flatMap(getTableRowDom),
  ]
}

export const getTableDom = (filteredKeyBindings, displayKeyBindings, columnWidth1, columnWidth2, columnWidth3) => {
  const tableDom = [
    table(
      {
        className: ClassNames.KeyBindingsTable,
        ariaLabel: UiStrings.KeyBindings,
        ariaRowCount: filteredKeyBindings.length,
      },
      3
    ),
    colgroup({}, 3),
    col(
      {
        width: columnWidth1,
      },
      0
    ),
    col(
      {
        width: columnWidth2,
      },
      0
    ),
    col(
      {
        width: columnWidth3,
      },
      0
    ),
    ...staticTableHeadDom,
    ...getTableBodyDom(displayKeyBindings),
  ]
  return tableDom
}
