import * as GetVisibleCompletionItems from '../GetVisibleCompletionItems/GetVisibleCompletionItems.js'
import * as RenderMethod from '../RenderMethod/RenderMethod.js'

export const hasFunctionalRender = true

const renderItems = {
  isEqual(oldState, newState) {
    return oldState.items === newState.items && oldState.minLineY === newState.minLineY && oldState.maxLineY === newState.maxLineY
  },
  apply(oldState, newState) {
    const visibleItems = GetVisibleCompletionItems.getVisibleItems(newState.items, newState.minLineY, newState.maxLineY)
    return [/* method */ RenderMethod.SetItems, /* items */ visibleItems, /* reason */ 1]
  },
}

const renderBounds = {
  isEqual(oldState, newState) {
    return (
      oldState.items === newState.items &&
      oldState.minLineY === newState.minLineY &&
      oldState.maxLineY === newState.maxLineY &&
      oldState.x === newState.x &&
      oldState.y === newState.y
    )
  },
  apply(oldState, newState) {
    const { x, y, width, height } = newState
    return [/* method */ RenderMethod.SetBounds, /* x */ x, /* y */ y, /* width */ width, /* height */ height]
  },
}

const renderFocusedIndex = {
  isEqual(oldState, newState) {
    return oldState.focusedIndex === newState.focusedIndex
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetFocusedIndex, /* oldFocusedIndex */ oldState.focusedIndex, /* newFocusedIndex */ newState.focusedIndex]
  },
}

export const render = [renderItems, renderBounds, renderFocusedIndex]
