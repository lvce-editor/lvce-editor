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

const DomElements = {
  Tr: 'tr',
  Td: 'td',
  Text: 'text',
}

const emptyChildren = []

const getTableRowDom = (keyBinding) => {
  return {
    flags: DomFlags.Element,
    type: DomElements.Tr,
    props: {
      ariaRowIndex: 1,
      className: 'KeyBindingsTableRow',
    },
    children: [
      {
        flags: DomFlags.Element,
        type: DomElements.Td,
        props: {
          className: 'KeyBindingsTableCell',
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
          className: 'KeyBindingsTableCell',
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
      },
      {
        flags: DomFlags.Element,
        type: DomElements.Td,
        props: {
          className: 'KeyBindingsTableCell',
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

const getTableDom = (displayKeyBindings) => {
  const tableDom = displayKeyBindings.map(getTableRowDom)
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
    const tableDom = getTableDom(displayKeyBindings)
    return [
      /* viewletSend */ 'Viewlet.send',
      /* id */ 'KeyBindings',
      /* method */ 'setTableDom',
      /* tableDom */ tableDom,
    ]
  },
}

const renderTableBodyHeight = {
  isEqual(oldState, newState) {
    return oldState.filteredKeyBindings === newState.filteredKeyBindings
  },
  apply(oldState, newState) {
    return [
      /* viewletSend */ 'Viewlet.send',
      /* id */ 'KeyBindings',
      /* method */ 'setTbodyHeight',
      /* height */ 0,
    ]
  },
}

const renderRowCount = {
  isEqual(oldState, newState) {
    return (
      oldState.filteredKeyBindings.length ===
      newState.filteredKeyBindings.length
    )
  },
  apply(oldState, newState) {
    const rowCount = newState.filteredKeyBindings.length + 1 // one extra because of table header row
    return [
      /* viewletSend */ 'Viewlet.send',
      /* id */ 'KeyBindings',
      /* method */ 'setRowCount',
      /* rowCount */ rowCount,
    ]
  },
}

export const render = [renderKeyBindings, renderTableBodyHeight, renderRowCount]
