import * as RenderMethod from '../RenderMethod/RenderMethod.js'
import * as GetVisibleQuickPickItems from '../GetVisibleQuickPickItems/GetVisibleQuickPickItems.js'

export const hasFunctionalRender = true

const renderValue = {
  isEqual(oldState, newState) {
    return oldState.value === newState.value
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetValue, /* value */ newState.value]
  },
}

const renderCursorOffset = {
  isEqual(oldState, newState) {
    oldState.cursorOffset === newState.cursorOffset || newState.cursorOffset === newState.value.length
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetCursorOffset, /* cursorOffset */ newState.cursorOffset]
  },
}

const renderItems = {
  isEqual(oldState, newState) {
    return oldState.items === newState.items && oldState.minLineY === newState.minLineY && oldState.maxLineY === newState.maxLineY
  },
  apply(oldState, newState) {
    if (newState.items.length === 0) {
      return [/* method */ 'showNoResults']
    }
    const visibleItems = GetVisibleQuickPickItems.getVisible(newState.provider, newState.items, newState.minLineY, newState.maxLineY)
    return [/* method */ RenderMethod.SetVisiblePicks, /* visiblePicks */ visibleItems]
  },
}

const renderFocusedIndex = {
  isEqual(oldState, newState) {
    return oldState.focusedIndex === newState.focusedIndex
  },
  apply(oldState, newState) {
    const oldFocusedIndex = oldState.focusedIndex - oldState.minLineY
    const newFocusedIndex = newState.focusedIndex - newState.minLineY
    return [/* method */ RenderMethod.SetFocusedIndex, /* oldFocusedIndex */ oldFocusedIndex, /* newFocusedIndex */ newFocusedIndex]
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
    return [/* method */ RenderMethod.SetItemsHeight, /* height */ height]
  },
}

export const render = [renderItems, renderValue, renderCursorOffset, renderFocusedIndex, renderHeight]
