import {
  kbd,
  table,
  tbody,
  td,
  text,
  th,
  thead,
  tr,
} from '../VirtualDomHelpers/VirtualDomHelpers.js'

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

// TODO needing childCount variable everywhere can be error prone
const getKeyBindingCellChildren = (keyBinding) => {
  const children = []
  let childCount = 0
  if (keyBinding.isCtrl) {
    childCount += 2
    children.push(kbdDom, text('Ctrl'), text('+'))
  }
  if (keyBinding.isShift) {
    childCount += 2
    children.push(kbdDom, text('Shift'), text('+'))
  }
  childCount++
  children.push(kbdDom, text(keyBinding.key))
  return { children, childCount }
}

const tableCellProps = {
  className: ClassNames.KeyBindingsTableCell,
}

const tableCell = td(tableCellProps, 1)

const getTableRowDom = (keyBinding) => {
  const { children, childCount } = getKeyBindingCellChildren(keyBinding)
  return [
    tr(
      {
        ariaRowIndex: keyBinding.rowIndex,
        className: ClassNames.KeyBindingsTableRow,
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
    tbody(
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
    table(
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

// const getDom = () => {
//   return [
//     div({}, 2),
//     div({ className: ClassNames.KeyBindingsHeader }, 1),
//     input(
//       {
//         type: 'search',
//         placeholder: UiStrings.SearchKeyBindings,
//         on: {
//           input: 'ViewletKeyBindings.handleInput',
//         },
//       },
//       0
//     ),
//   ]
// }

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

const renderValue = {
  isEqual(oldState, newState) {
    return oldState.value === newState.value
  },
  apply(oldState, newState) {
    return [
      /* viewletSend */ 'Viewlet.send',
      /* id */ 'KeyBindings',
      /* method */ 'setValue',
      /* setValue */ newState.value,
    ]
  },
}

const renderNoResults = {
  isEqual(oldState, newState) {
    return (
      oldState.value === newState.value &&
      newState.filteredKeyBindings.length === 0
    )
  },
  apply(oldState, newState) {
    const message =
      newState.filteredKeyBindings.length === 0 ? 'No Results found' : ''
    return [
      /* Viewlet.ariaAnnounce */ 'Viewlet.ariaAnnounce',
      /* message */ message,
    ]
  },
}

export const render = [renderKeyBindings, renderValue, renderNoResults]
