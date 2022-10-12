export * from '../ViewletQuickPick/ViewletQuickPick.js'
import * as ElectronBrowserView from '../ElectronBrowserView/ElectronBrowserView.js'

const renderValue = {
  isEqual(oldState, newState) {
    return oldState.value === newState.value
  },
  apply(oldState, newState) {
    ElectronBrowserView.setQuickPickValue(newState.value)
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

const renderItems = {
  isEqual(oldState, newState) {
    return (
      oldState.items === newState.items &&
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
  },
}

const renderFocusedIndex = {
  isEqual(oldState, newState) {
    return oldState.focusedIndex === newState.focusedIndex
  },
  apply(oldState, newState) {},
}

const renderHeight = {
  isEqual(oldState, newState) {
    return oldState.items.length === newState.items.length
  },
  apply(oldState, newState) {},
}

export const render = [
  renderItems,
  renderValue,
  renderCursorOffset,
  renderFocusedIndex,
  renderHeight,
]

export * from '../VirtualList/VirtualList.js'
