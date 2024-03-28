import * as GetQuickPickItemsVirtualDom from '../GetQuickPickItemsVirtualDom/GetQuickPickItemsVirtualDom.js'
import * as GetVisibleQuickPickItems from '../GetVisibleQuickPickItems/GetVisibleQuickPickItems.js'
import * as InputSource from '../InputSource/InputSource.js'
import * as RenderMethod from '../RenderMethod/RenderMethod.js'

export const hasFunctionalRender = true

const renderValue = {
  isEqual(oldState, newState) {
    return newState.inputSource === InputSource.User || oldState.value === newState.value
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetValue, /* value */ newState.value]
  },
}

const renderCursorOffset = {
  isEqual(oldState, newState) {
    return (
      newState.inputSource === InputSource.User || oldState.cursorOffset === newState.cursorOffset || newState.cursorOffset === newState.value.length
    )
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetCursorOffset, /* cursorOffset */ newState.cursorOffset]
  },
}

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
    const visibleItems = GetVisibleQuickPickItems.getVisible(
      newState.provider,
      newState.items,
      newState.minLineY,
      newState.maxLineY,
      newState.focusedIndex,
    )
    const dom = GetQuickPickItemsVirtualDom.getQuickPickItemsVirtualDom(visibleItems)
    return [/* method */ 'setItemsDom', dom]
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
    if (newState.items.length === 0) {
      return [/* method */ RenderMethod.SetItemsHeight, /* height */ newState.itemHeight]
    }
    const maxLineY = Math.min(newState.maxLineY, newState.items.length)
    const itemCount = maxLineY - newState.minLineY
    const height = itemCount * newState.itemHeight
    return [/* method */ RenderMethod.SetItemsHeight, /* height */ height]
  },
}

export const render = [renderItems, renderValue, renderCursorOffset, renderFocusedIndex, renderHeight]
