// Based on VS Code's KeyBindings Editor (License MIT):
// see https://github.com/microsoft/vscode/blob/6a5e3aad96929a7d35e09ed8d22e87a72bd16ff6/src/vs/workbench/services/preferences/browser/keybindingsEditorModel.ts
// see https://github.com/microsoft/vscode/blob/6a5e3aad96929a7d35e09ed8d22e87a72bd16ff6/src/vs/workbench/contrib/preferences/browser/keybindingsEditor.ts

import * as FilterKeyBindings from '../FilterKeyBindings/FilterKeyBindings.js'
import * as KeyBindingsInitial from '../KeyBindingsInitial/KeyBindingsInitial.js'
import * as ParseKeyBindings from '../ParseKeyBindings/ParseKeyBindings.js'

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
    value: '',
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

const getMaxVisibleItems = (
  height,
  searchHeaderHeight,
  tableHeaderHeight,
  rowHeight
) => {
  return Math.floor(
    (height - searchHeaderHeight - tableHeaderHeight) / rowHeight
  )
}

export const loadContent = async (state, savedState) => {
  const { height, rowHeight } = state
  const keyBindings = await KeyBindingsInitial.getKeyBindings()
  const parsedKeyBindings = ParseKeyBindings.parseKeyBindings(keyBindings)
  const searchHeaderHeight = 50
  const tableHeaderHeight = 24
  const maxVisibleItems = getMaxVisibleItems(
    height,
    searchHeaderHeight,
    tableHeaderHeight,
    rowHeight
  )
  const savedValue = getSavedValue(savedState)
  const filteredKeyBindings = FilterKeyBindings.getFilteredKeyBindings(
    parsedKeyBindings,
    savedValue
  )
  const maxLineY = Math.min(filteredKeyBindings.length, maxVisibleItems)
  return {
    ...state,
    parsedKeyBindings,
    filteredKeyBindings,
    maxLineY,
    maxVisibleItems,
    value: savedValue,
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

export const hasFunctionalRender = true

export * from './ViewletKeyBindingsRender.js'
