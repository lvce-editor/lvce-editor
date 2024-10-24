// Based on VS Code's KeyBindings Editor (License MIT):
// see https://github.com/microsoft/vscode/blob/6a5e3aad96929a7d35e09ed8d22e87a72bd16ff6/src/vs/workbench/services/preferences/browser/keybindingsEditorModel.ts
// see https://github.com/microsoft/vscode/blob/6a5e3aad96929a7d35e09ed8d22e87a72bd16ff6/src/vs/workbench/contrib/preferences/browser/keybindingsEditor.ts

import * as Assert from '../Assert/Assert.ts'
import * as ContextMenu from '../ContextMenu/ContextMenu.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as Focus from '../Focus/Focus.js'
import * as KeyBindingsInitial from '../KeyBindingsInitial/KeyBindingsInitial.js'
import * as KeyBindingsViewWorker from '../KeyBindingsViewWorker/KeyBindingsViewWorker.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as WhenExpression from '../WhenExpression/WhenExpression.js'

// TODO make this an extension that can create virtual dom in a webworker

export const create = (id, uri, x, y, width, height) => {
  return {
    parsedKeyBindings: [],
    filteredKeyBindings: [],
    minLineY: 0,
    maxLineY: 0,
    maxVisibleItems: 0,
    rowHeight: 24,
    x,
    y,
    width,
    height,
    value: '',
    selectedIndex: -1,
    focusedIndex: -1,
    finalDeltaY: 0,
    deltaY: 0,
    uri,
    columnWidth1: 0,
    columnWidth2: 0,
    columnWidth3: 0,
    contentPadding: 30,
    resizerDownId: 0,
    defineKeyBindingsId: -1,
    editIconSize: 22,
    padding: 15,
    searchHeaderHeight: 50,
    tableHeaderHeight: 24,
  }
}

export const saveState = (state) => {
  const { value } = state
  return {
    value,
  }
}

const getSavedValue = (savedState) => {
  if (savedState && savedState.value) {
    return savedState.value
  }
  return ''
}

const getMaxVisibleItems = (height, searchHeaderHeight, tableHeaderHeight, rowHeight) => {
  return Math.floor((height - searchHeaderHeight - tableHeaderHeight) / rowHeight)
}

export const loadContent = async (state, savedState) => {
  const { height, rowHeight, width, contentPadding, searchHeaderHeight, tableHeaderHeight } = state
  Assert.number(width)
  const keyBindings = await KeyBindingsInitial.getKeyBindings()
  const parsedKeyBindings = await KeyBindingsViewWorker.invoke('ParseKeyBindings.parseKeyBindings', keyBindings)
  const maxVisibleItems = getMaxVisibleItems(height, searchHeaderHeight, tableHeaderHeight, rowHeight)
  const savedValue = getSavedValue(savedState)
  const filteredKeyBindings = await KeyBindingsViewWorker.invoke('FilterKeyBindings.filterKeyBindings', parsedKeyBindings, savedValue)
  const listHeight = height - searchHeaderHeight - tableHeaderHeight
  const contentHeight = 2121
  const scrollBarHeight = ScrollBarFunctions.getScrollBarSize(listHeight, contentHeight, 10)
  const maxLineY = Math.min(filteredKeyBindings.length, maxVisibleItems)
  const finalDeltaY = Math.max(contentHeight - listHeight, 0)
  const contentWidth = width - contentPadding
  const columnWidth1 = contentWidth / 3
  const columnWidth2 = contentWidth / 3
  const columnWidth3 = contentWidth / 3
  const newState = {
    ...state,
    parsedKeyBindings,
    filteredKeyBindings,
    maxLineY,
    maxVisibleItems,
    value: savedValue,
    scrollBarHeight,
    finalDeltaY,
    columnWidth1,
    columnWidth2,
    columnWidth3,
  }
  const commands = await KeyBindingsViewWorker.invoke('KeyBindings.render', state, newState)
  newState.commands = commands
  return newState
}

export const handleInput = async (state, value) => {
  const { parsedKeyBindings, maxVisibleItems } = state
  const filteredKeyBindings = await KeyBindingsViewWorker.invoke('FilterKeyBindings.filterKeyBindings', parsedKeyBindings, value)
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
  const maxDeltaY = Math.max(filteredKeyBindings.length * rowHeight - tableHeight, 0)
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

export const handleWheel = (state, deltaMode, deltaY) => {
  return setDeltaY(state, state.deltaY + deltaY)
}

const getIndex = (state, eventX, eventY) => {
  const { minLineY, y, rowHeight, tableHeaderHeight, searchHeaderHeight } = state
  const relativeY = eventY - y - tableHeaderHeight - searchHeaderHeight
  const row = Math.floor(relativeY / rowHeight)
  return minLineY + row
}

export const handleClick = (state, eventX, eventY) => {
  const { padding, editIconSize, x } = state
  const selectedIndex = getIndex(state, eventX, eventY)
  const relativeX = eventX - x
  if (relativeX > padding && relativeX < padding + editIconSize) {
    showDefineWidget(state, selectedIndex)
  } else {
    // TODO avoid side effect, make focus functional
    Focus.setFocus(WhenExpression.FocusKeyBindingsTable)
  }
  return {
    ...state,
    focusedIndex: selectedIndex,
    selectedIndex,
  }
}

const showDefineWidget = async (state, selectedIndex) => {
  await Viewlet.openWidget(ViewletModuleId.DefineKeyBinding)
}

export const handleDefineKeyBindingDisposed = async (state, key) => {
  if (key) {
    // TODO
    await FileSystem.writeFile(
      'app://keybindings.json',
      JSON.stringify([
        {
          key,
        },
      ]),
    )
  }
  // TODO
  return state
}

export const handleDoubleClick = async (state, eventX, eventY) => {
  const selectedIndex = getIndex(state, eventX, eventY)
  // TODO wait promise?
  showDefineWidget(state, selectedIndex)
  return {
    ...state,
    focusedIndex: selectedIndex,
    selectedIndex,
    defineKeyBindingsId: 1,
  }
}

export const handleResizerClick = (state, id, x) => {
  return {
    ...state,
    resizerDownId: id,
  }
}

export const handleResizerMove = (state, eventX) => {
  // @ts-ignore
  const { resizerDownId, contentPadding, width, columnWidth1, columnWidth2, columnWidth3, x } = state
  const contentWidth = width - contentPadding
  if (resizerDownId === 1) {
    const newColumnWidth1 = eventX - contentPadding - x
    const newColumnWidth3 = contentWidth - newColumnWidth1 - columnWidth2
    return {
      ...state,
      columnWidth1: newColumnWidth1,
      columnWidth3: newColumnWidth3,
    }
  }
  const newColumnWidth3 = contentWidth - (eventX - contentPadding - x)
  const newColumnWidth2 = contentWidth - newColumnWidth3 - columnWidth1
  return {
    ...state,
    columnWidth2: newColumnWidth2,
    columnWidth3: newColumnWidth3,
  }
}

export const focusFirst = (state) => {
  return {
    ...state,
    selectedIndex: 0,
  }
}

export const focusLast = (state) => {
  const { filteredKeyBindings } = state
  return {
    ...state,
    selectedIndex: filteredKeyBindings.length - 1,
  }
}

export const handleContextMenu = async (state, button, x, y) => {
  await ContextMenu.show(x, y, MenuEntryId.KeyBindingsTable)
  return state
}

export const focusNext = (state) => {
  const { selectedIndex, filteredKeyBindings } = state
  return {
    ...state,
    selectedIndex: Math.min(selectedIndex + 1, filteredKeyBindings.length - 1),
  }
}

export const focusPrevious = (state) => {
  const { selectedIndex } = state
  return {
    ...state,
    selectedIndex: Math.max(selectedIndex - 1, 0),
  }
}
