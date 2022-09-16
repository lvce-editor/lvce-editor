// Based on VS Code's KeyBindings Editor (License MIT):
// see https://github.com/microsoft/vscode/blob/6a5e3aad96929a7d35e09ed8d22e87a72bd16ff6/src/vs/workbench/services/preferences/browser/keybindingsEditorModel.ts
// see https://github.com/microsoft/vscode/blob/6a5e3aad96929a7d35e09ed8d22e87a72bd16ff6/src/vs/workbench/contrib/preferences/browser/keybindingsEditor.ts

import * as KeyBindingsInitial from '../KeyBindingsInitial/KeyBindingsInitial.js'
import * as ParseKeyBindings from '../ParseKeyBindings/ParseKeyBindings.js'
import * as FilterKeyBindings from '../FilterKeyBindings/FilterKeyBindings.js'

export const name = 'KeyBindings'

export const create = (id, uri, left, top, width, height) => {
  return {
    parsedKeyBindings: [],
    filteredKeyBindings: [],
    minLineY: 0,
    maxLineY: 0,
    maxVisibleItems: 0,
    rowHeight: 24,
    deltaY: 0,
    top,
    left,
    width,
    height,
  }
}

export const loadContent = async (state) => {
  const { height, rowHeight } = state
  const keyBindings = await KeyBindingsInitial.getKeyBindings()
  const parsedKeyBindings = ParseKeyBindings.parseKeyBindings(keyBindings)
  const filteredKeyBindings = parsedKeyBindings
  const searchHeaderHeight = 50
  const tableHeaderHeight = 24
  const maxVisibleItems = Math.floor(
    (height - searchHeaderHeight - tableHeaderHeight) / rowHeight
  )
  const maxLineY = Math.min(filteredKeyBindings.length, maxVisibleItems)
  return {
    ...state,
    parsedKeyBindings,
    filteredKeyBindings,
    maxLineY,
    maxVisibleItems,
  }
}

export const handleInput = (state, value) => {
  const { parsedKeyBindings, maxVisibleItems } = state
  const filteredKeyBindings = FilterKeyBindings.getFilteredKeyBindings(
    parsedKeyBindings,
    value
  )
  const maxLineY = Math.min(filteredKeyBindings.length, maxVisibleItems)
  return {
    ...state,
    value,
    filteredKeyBindings,
    maxLineY,
  }
}

export const setDeltaY = (state, deltaY) => {
  const { maxVisibleItems, rowHeight, filteredKeyBindings } = state
  const tableHeight = maxVisibleItems * rowHeight
  const minDeltaY = 0
  const maxDeltaY = Math.max(
    filteredKeyBindings.length * rowHeight - tableHeight,
    0
  )
  if (deltaY < minDeltaY) {
    deltaY = minDeltaY
  } else if (deltaY > maxDeltaY) {
    deltaY = Math.max(maxDeltaY)
  }
  const minLineY = Math.floor(deltaY / rowHeight)
  const maxLineY = minLineY + Math.round(tableHeight / rowHeight)
  return {
    ...state,
    deltaY,
    minLineY,
    maxLineY,
  }
}

export const handleWheel = (state, deltaY) => {
  return setDeltaY(state, state.deltaY + deltaY)
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

export const hasFunctionalRender = true

const DomFlags = {
  Element: 1,
  TextNode: 2,
}

/**
 * @enum {string}
 */
const DomElements = {
  Tr: 'tr',
  Td: 'td',
  Th: 'th',
  Text: 'text',
  Kbd: 'kbd',
  Table: 'table',
  THead: 'thead',
  TBody: 'tbody',
}

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
}

const emptyChildren = []
const emptyProps = {}

const getKeyBindingCellChildren = (keyBinding) => {
  const children = []
  if (keyBinding.isCtrl) {
    children.push(
      {
        flags: DomFlags.Element,
        type: DomElements.Kbd,
        props: {
          className: ClassNames.Key,
        },
        children: [
          {
            flags: DomFlags.TextNode,
            type: DomElements.Text,
            props: {
              text: 'Ctrl',
            },
            children: emptyChildren,
          },
        ],
      },
      {
        flags: DomFlags.Text,
        type: DomElements.Text,
        props: {
          text: '+',
        },
        children: emptyChildren,
      }
    )
  }
  if (keyBinding.isShift) {
    children.push(
      {
        flags: DomFlags.Element,
        type: DomElements.Kbd,
        props: {
          className: ClassNames.Key,
        },
        children: [
          {
            flags: DomFlags.TextNode,
            type: DomElements.Text,
            props: {
              text: 'Ctrl',
            },
            children: emptyChildren,
          },
        ],
      },
      {
        flags: DomFlags.Text,
        type: DomElements.Text,
        props: {
          text: '+',
        },
        children: emptyChildren,
      }
    )
  }
  children.push({
    flags: DomFlags.Element,
    type: DomElements.Kbd,
    props: {
      className: ClassNames.Key,
    },
    children: [
      {
        flags: DomFlags.TextNode,
        type: DomElements.Text,
        props: {
          text: keyBinding.key,
        },
        children: emptyChildren,
      },
    ],
  })
  return children
}

const getTableRowDom = (keyBinding) => {
  return {
    flags: DomFlags.Element,
    type: DomElements.Tr,
    props: {
      ariaRowIndex: keyBinding.rowIndex,
      className: ClassNames.KeyBindingsTableRow,
    },
    children: [
      {
        flags: DomFlags.Element,
        type: DomElements.Td,
        props: {
          className: ClassNames.KeyBindingsTableCell,
        },
        children: [
          {
            flags: DomFlags.TextNode,
            type: DomElements.Text,
            props: {
              text: keyBinding.command,
            },
            children: emptyChildren,
          },
        ],
      },
      {
        flags: DomFlags.Element,
        type: DomElements.Td,
        props: {
          className: ClassNames.KeyBindingsTableCell,
        },
        children: getKeyBindingCellChildren(keyBinding),
      },
      {
        flags: DomFlags.Element,
        type: DomElements.Td,
        props: {
          className: ClassNames.KeyBindingsTableCell,
        },
        children: [
          {
            flags: DomFlags.TextNode,
            type: DomElements.Text,
            props: {
              text: keyBinding.when,
            },
            children: emptyChildren,
          },
        ],
      },
    ],
  }
}

const getTableHeadDom = () => {
  return {
    flags: DomFlags.Element,
    type: DomElements.THead,
    props: {
      className: ClassNames.KeyBindingsTableHead,
    },
    children: [
      {
        flags: DomFlags.Element,
        type: DomElements.Tr,
        props: {
          className: ClassNames.KeyBindingsTableRow,
          ariaRowIndex: 1,
        },
        children: [
          {
            flags: DomFlags.Element,
            type: DomElements.Th,
            props: {
              className: ClassNames.KeyBindingsTableCell,
            },
            children: [
              {
                flags: DomFlags.TextNode,
                type: DomElements.Text,
                props: {
                  text: UiStrings.Command,
                },
                children: emptyChildren,
              },
            ],
          },
          {
            flags: DomFlags.Element,
            type: DomElements.Th,
            props: {
              className: ClassNames.KeyBindingsTableCell,
            },
            children: [
              {
                flags: DomFlags.TextNode,
                type: DomElements.Text,
                props: {
                  text: UiStrings.Key,
                },
                children: emptyChildren,
              },
            ],
          },
          {
            flags: DomFlags.Element,
            type: DomElements.Th,
            props: {
              className: ClassNames.KeyBindingsTableCell,
            },
            children: [
              {
                flags: DomFlags.TextNode,
                type: DomElements.Text,
                props: {
                  text: UiStrings.When,
                },
                children: emptyChildren,
              },
            ],
          },
        ],
      },
    ],
  }
}

const getTableBodyDom = (displayKeyBindings) => {
  return {
    flags: DomFlags.Element,
    type: DomElements.TBody,
    props: {
      className: ClassNames.KeyBindingsTableBody,
    },
    children: displayKeyBindings.map(getTableRowDom),
  }
}

const getTableDom = (filteredKeyBindings, displayKeyBindings) => {
  const tableDom = [
    {
      flags: DomFlags.Element,
      type: DomElements.Table,
      props: {
        className: ClassNames.KeyBindingsTable,
        ariaLabel: UiStrings.KeyBindings,
        ariaRowCount: filteredKeyBindings.length,
      },
      children: [getTableHeadDom(), getTableBodyDom(displayKeyBindings)],
    },
  ]
  return tableDom
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
    const tableDom = getTableDom(filteredKeyBindings, displayKeyBindings)
    return [
      /* viewletSend */ 'Viewlet.send',
      /* id */ 'KeyBindings',
      /* method */ 'setTableDom',
      /* tableDom */ tableDom,
    ]
  },
}

export const render = [renderKeyBindings]
