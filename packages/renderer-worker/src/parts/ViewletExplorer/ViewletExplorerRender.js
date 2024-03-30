import * as GetExplorerVirtualDom from '../GetExplorerVirtualDom/GetExplorerVirtualDom.js'
import * as GetVisibleExplorerItems from '../GetVisibleExplorerItems/GetVisibleExplorerItems.js'

export const hasFunctionalRender = true

const renderItems = {
  isEqual(oldState, newState) {
    return (
      oldState.items === newState.items &&
      oldState.minLineY === newState.minLineY &&
      oldState.maxLineY === newState.maxLineY &&
      oldState.focusedIndex === newState.focusedIndex &&
      oldState.editingIndex === newState.editingIndex &&
      oldState.editingType === newState.editingType &&
      oldState.editingValue === newState.editingValue
    )
  },
  apply(oldState, newState) {
    const visibleDirents = GetVisibleExplorerItems.getVisibleExplorerItems(
      newState.items,
      newState.minLineY,
      newState.maxLineY,
      newState.focusedIndex,
      newState.editingIndex,
      newState.editingType,
      newState.editingValue,
    )
    const dom = GetExplorerVirtualDom.getExplorerVirtualDom(visibleDirents).slice(1)
    return ['setDom', dom]
  },
}

const renderFocusedIndex = {
  isEqual(oldState, newState) {
    return oldState.focusedIndex === newState.focusedIndex && oldState.focused === newState.focused && oldState.minLineY === newState.minLineY
  },
  apply(oldState, newState) {
    const oldFocusedIndex = oldState.focusedIndex - oldState.minLineY
    const newFocusedIndex = newState.focusedIndex - newState.minLineY
    return [/* method */ 'setFocusedIndex', /* oldindex */ oldFocusedIndex, /* newIndex */ newFocusedIndex, /* focused */ newState.focused]
  },
}

const renderDropTargets = {
  isEqual(oldState, newState) {
    return oldState.dropTargets === newState.dropTargets
  },
  apply(oldState, newState) {
    return [/* method */ 'setDropTargets', /* oldDropTargets */ oldState.dropTargets, /* newDropTargets */ newState.dropTargets]
  },
}

const renderEditingIndex = {
  isEqual(oldState, newState) {
    return oldState.editingIndex === newState.editingIndex && oldState.editingType === newState.editingType
  },
  apply(oldState, newState) {
    const { editingIndex, editingType, editingValue } = newState
    return ['focusInput', 'ExplorerInput']
  },
}

export const render = [renderItems, renderDropTargets, renderFocusedIndex, renderEditingIndex]
