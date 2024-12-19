// Based on VS Code's KeyBindings Editor (License MIT):
// see https://github.com/microsoft/vscode/blob/6a5e3aad96929a7d35e09ed8d22e87a72bd16ff6/src/vs/workbench/services/preferences/browser/keybindingsEditorModel.ts
// see https://github.com/microsoft/vscode/blob/6a5e3aad96929a7d35e09ed8d22e87a72bd16ff6/src/vs/workbench/contrib/preferences/browser/keybindingsEditor.ts

import * as ContextMenu from '../ContextMenu/ContextMenu.js'
import * as FileSystem from '../FileSystem/FileSystem.js'
import * as Focus from '../Focus/Focus.js'
import * as KeyBindingsViewWorker from '../KeyBindingsViewWorker/KeyBindingsViewWorker.js'
import * as MenuEntryId from '../MenuEntryId/MenuEntryId.js'
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
  return KeyBindingsViewWorker.invoke('KeyBindings.saveState', state)
}

export const loadContent = async (state, savedState) => {
  const newState = await KeyBindingsViewWorker.invoke('KeyBindings.loadContent', state, savedState)
  const commands = await KeyBindingsViewWorker.invoke('KeyBindings.render', state, newState)
  newState.commands = commands
  return newState
}

export const handleInput = async (state, value) => {
  return KeyBindingsViewWorker.invoke('KeyBindings.handleInput', state, value)
}

export const setDeltaY = (state, deltaY) => {
  return KeyBindingsViewWorker.invoke('KeyBindings.setDeltaY', state, deltaY)
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
  return KeyBindingsViewWorker.invoke('KeyBindings.handleResizerMove', state, eventX)
}

export const focusFirst = (state) => {
  return KeyBindingsViewWorker.invoke('KeyBindings.focusFirst', state)
}

export const focusLast = (state) => {
  return KeyBindingsViewWorker.invoke('KeyBindings.focusLast', state)
}

export const handleContextMenu = async (state, button, x, y) => {
  await ContextMenu.show(x, y, MenuEntryId.KeyBindingsTable)
  return state
}

export const focusNext = (state) => {
  return KeyBindingsViewWorker.invoke('KeyBindings.focusNext', state)
}

export const focusPrevious = (state) => {
  return KeyBindingsViewWorker.invoke('KeyBindings.focusPrevious', state)
}
