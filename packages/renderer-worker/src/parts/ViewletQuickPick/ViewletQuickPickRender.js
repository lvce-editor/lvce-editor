import {
  div,
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
  Label: 'Label',
  QuickPickItem: 'QuickPickItem',
  Icon: 'Icon',
  QuickPickItemDescription: 'QuickPickItemDescription',
  QuickPickStatus: 'QuickPickStatus',
}

/**
 * @enum {string}
 */
const Ids = {
  QuickPickHeader: 'QuickPickHeader',
  QuickPickItems: 'QuickPickItems',
  QuickPick: 'QuickPick',
}

/**
 * @enum {string}
 */
const Roles = {
  ListBox: 'listbox',
  ComboBox: 'combobox',
  Option: 'option',
}

/**
 * @enum {string}
 */
const UiStrings = {
  QuickInput: 'Quick Input',
}

const QuickPickItem = (item) => {
  return [
    div(
      {
        className: ClassNames.QuickPickItem,
      },
      1
    ),
    text(item.label),
  ]
}

const QuickPickItems = (items) => {
  return [
    div(
      {
        id: Ids.QuickPickItems,
        role: Roles.ListBox,
        ariaRoleDescription: UiStrings.QuickInput,
      },
      items.length
    ),
    ...items.flatMap(QuickPickItem),
  ]
}

const getVisible = (items, minLineY, maxLineY) => {
  const visibleItems = []
  const setSize = items.length
  const max = Math.min(items.length, maxLineY)
  for (let i = minLineY; i < max; i++) {
    const item = items[i]
    visibleItems.push({
      label: item.label,
      icon: item.icon,
      posInSet: i + 1,
      setSize,
    })
  }
  return visibleItems
}

const renderItems = {
  isEqual(oldState, newState) {
    return (
      oldState.filteredKeyBindings === newState.filteredKeyBindings &&
      oldState.minLineY === newState.minLineY &&
      oldState.maxLineY === newState.maxLineY
    )
  },
  apply(oldState, newState) {
    if (newState.items.length === 0) {
      return [
        /* Viewlet.send */ 'Viewlet.send',
        /* id */ 'QuickPick',
        /* method */ 'showNoResults',
      ]
    }
    const visibleItems = getVisible(
      newState.items,
      newState.minLineY,
      newState.maxLineY
    )
    const dom = QuickPickItems(visibleItems)
    return [
      /* viewletSend */ 'Viewlet.send',
      /* id */ 'QuickPick',
      /* method */ 'setDom',
      /* tableDom */ dom,
    ]
  },
}

const renderFocusedIndex = {
  isEqual(oldState, newState) {
    return oldState.focusedIndex === newState.focusedIndex
  },
  apply(oldState, newState) {
    const oldFocusedIndex = oldState.focusedIndex - oldState.minLineY
    const newFocusedIndex = newState.focusedIndex - newState.minLineY
    console.log('focus', oldState.focusedIndex, newState.focusedIndex)
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'QuickPick',
      /* method */ 'setFocusedIndex',
      /* oldFocusedIndex */ oldFocusedIndex,
      /* newFocusedIndex */ newFocusedIndex,
    ]
  },
}

const renderHeight = {
  isEqual(oldState, newState) {
    return oldState.items.length === newState.items.length
  },
  apply(oldState, newState) {
    const maxLineY = Math.min(newState.maxLineY, newState.items.length)
    const itemCount = maxLineY - newState.minLineY
    const height = itemCount * newState.itemHeight
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'QuickPick',
      /* method */ 'setItemsHeight',
      /* height */ height,
    ]
  },
}

export const hasFunctionalRender = true

const renderValue = {
  isEqual(oldState, newState) {
    return oldState.value === newState.value
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'QuickPick',
      /* method */ 'setValue',
      /* value */ newState.value,
    ]
  },
}

const renderCursorOffset = {
  isEqual(oldState, newState) {
    oldState.cursorOffset === newState.cursorOffset ||
      newState.cursorOffset === newState.value.length
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'QuickPick',
      /* method */ 'setCursorOffset',
      /* cursorOffset */ newState.cursorOffset,
    ]
  },
}

export const render = [
  renderItems,
  renderValue,
  renderCursorOffset,
  renderFocusedIndex,
  renderHeight,
]
