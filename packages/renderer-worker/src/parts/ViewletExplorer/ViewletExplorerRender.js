import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.js'
import * as GetExplorerVirtualDom from '../GetExplorerVirtualDom/GetExplorerVirtualDom.js'
import * as GetVisibleExplorerItems from '../GetVisibleExplorerItems/GetVisibleExplorerItems.js'

export const hasFunctionalRender = true

const renderItems = {
  isEqual(oldState, newState) {
    return (
      oldState.items === newState.items &&
      oldState.minLineY === newState.minLineY &&
      oldState.maxLineY === newState.maxLineY &&
      oldState.focusedIndex === newState.focusedIndex
    )
  },
  apply(oldState, newState) {
    const visibleDirents = GetVisibleExplorerItems.getVisibleExplorerItems(
      newState.items,
      newState.minLineY,
      newState.maxLineY,
      newState.focusedIndex,
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
    if (editingIndex === -1) {
      if (oldState.editingType === ExplorerEditingType.CreateFile || oldState.editingType === ExplorerEditingType.CreateFolder) {
        return [/* method */ 'hideEditBox', /* index */ oldState.editingIndex]
      }
      if (oldState.editingType === ExplorerEditingType.Rename) {
        const dirent = newState.items[oldState.editingIndex]
        return [/* method */ 'replaceEditBox', /* index */ oldState.editingIndex, /* dirent */ dirent]
      }
      return [/* method */ 'insertEditBox', /* index */ editingIndex, /* value */ editingValue]
    }
    if (editingType === ExplorerEditingType.CreateFile || editingType === ExplorerEditingType.CreateFolder) {
      return [/* method */ 'insertEditBox', /* index */ editingIndex, /* value */ editingValue]
    }
    return [/* method */ 'replaceWithEditBox', /* index */ editingIndex, /* value */ editingValue]
  },
}

const renderEditingIcon = {
  isEqual(oldState, newState) {
    return oldState.editingValue === newState.editingValue
  },
  apply(oldState, newState) {
    return [/* method */ 'setEditingIcon', /* index */ newState.editingIndex, /* value */ newState.editingIcon]
  },
}

export const render = [renderEditingIndex, renderItems, renderDropTargets, renderFocusedIndex, renderEditingIcon]
