import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text, h } from '../VirtualDomHelpers/VirtualDomHelpers.js'

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
}

const kbd = h(
  VirtualDomElements.Kbd,
  {
    className: ClassNames.Key,
  },
  1
)

// TODO needing childCount variable everywhere can be error prone
const getKeyBindingCellChildren = (keyBinding) => {
  const children = []
  let childCount = 0
  if (keyBinding.isCtrl) {
    childCount += 2
    children.push(kbd, text('Ctrl'), text('+'))
  }
  if (keyBinding.isShift) {
    childCount += 2
    children.push(kbd, text('Shift'), text('+'))
  }
  childCount++
  children.push(kbd, text(keyBinding.key))
  return { children, childCount }
}

const tableCellProps = {
  className: ClassNames.KeyBindingsTableCell,
}

const tableCell = h(VirtualDomElements.Td, tableCellProps, 1)

const getTableRowDom = (keyBinding) => {
  const { children, childCount } = getKeyBindingCellChildren(keyBinding)
  return [
    h(
      VirtualDomElements.Tr,
      {
        ariaRowIndex: keyBinding.rowIndex,
        className: ClassNames.KeyBindingsTableRow,
      },
      3
    ),
    tableCell,
    text(keyBinding.command),
    h(VirtualDomElements.Td, tableCellProps, childCount),
    ...children,
    tableCell,
    text(keyBinding.when || UiStrings.EmptyString),
  ]
}

const tableHead = h(
  VirtualDomElements.THead,
  {
    className: ClassNames.KeyBindingsTableHead,
  },
  1
)

const tableHeadRow = h(
  VirtualDomElements.Tr,
  {
    className: ClassNames.KeyBindingsTableRow,
    ariaRowIndex: 1,
  },
  3
)

const tableHeading = h(VirtualDomElements.Th, tableCellProps, 1)

const tableHeadDom = [
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
    h(
      VirtualDomElements.TBody,
      {
        className: ClassNames.KeyBindingsTableBody,
      },
      displayKeyBindings.length
    ),
    ...displayKeyBindings.flatMap(getTableRowDom),
  ]
}

const getTableDom = (filteredKeyBindings, displayKeyBindings) => {
  const tableDom = [
    h(
      VirtualDomElements.Table,
      {
        className: ClassNames.KeyBindingsTable,
        ariaLabel: UiStrings.KeyBindings,
        ariaRowCount: filteredKeyBindings.length,
      },
      2
    ),
    ...tableHeadDom,
    ...getTableBodyDom(displayKeyBindings),
  ]
  return tableDom
}

const getVisible = (filteredKeyBindings, minLineY, maxLineY) => {
  const visibleKeyBindings = []
  const slicedKeyBindings = filteredKeyBindings.slice(minLineY, maxLineY)
  for (let i = 0; i < slicedKeyBindings.length; i++) {
    const slicedKeyBinding = slicedKeyBindings[i]
    visibleKeyBindings.push({
      rowIndex: minLineY + i + 2,
      isCtrl: slicedKeyBinding.isCtrl,
      isShift: slicedKeyBinding.isShift,
      key: slicedKeyBinding.key,
      when: slicedKeyBinding.when,
      command: slicedKeyBinding.command,
    })
  }
  return visibleKeyBindings
}

const renderKeyBindings = {
  isEqual(oldState, newState) {
    return (
      oldState.filteredKeyBindings === newState.filteredKeyBindings &&
      oldState.minLineY === newState.minLineY &&
      oldState.maxLineY === newState.maxLineY
    )
  },
  apply(oldState, newState) {
    const { filteredKeyBindings, minLineY, maxLineY } = newState
    const displayKeyBindings = getVisible(
      filteredKeyBindings,
      minLineY,
      maxLineY
    )
    // TODO do dom diffing for faster incremental updates, e.g. when scrolling
    // console.time('tableDom')
    const tableDom = getTableDom(filteredKeyBindings, displayKeyBindings)
    // console.timeEnd('tableDom')
    // console.log({ tableDom })
    return [
      /* viewletSend */ 'Viewlet.send',
      /* id */ 'KeyBindings',
      /* method */ 'setTableDom',
      /* tableDom */ tableDom,
    ]
  },
}

export const render = [renderKeyBindings]
