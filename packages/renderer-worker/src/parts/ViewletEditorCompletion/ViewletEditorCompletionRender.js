import * as EditorCompletionMap from '../EditorCompletionMap/EditorCompletionMap.js'
import * as RenderMethod from '../RenderMethod/RenderMethod.js'

const getLabel = (item) => {
  return item.label
}

export const hasFunctionalRender = true

const getVisibleItems = (filteredItems, minLineY, maxLineY) => {
  const visibleItems = []
  for (let i = minLineY; i < maxLineY; i++) {
    const filteredItem = filteredItems[i]
    visibleItems.push({
      label: getLabel(filteredItem),
      icon: EditorCompletionMap.getIcon(filteredItem),
    })
  }
  return visibleItems
}

const renderItems = {
  isEqual(oldState, newState) {
    return oldState.items === newState.items && oldState.minLineY === newState.minLineY && oldState.maxLineY === newState.maxLineY
  },
  apply(oldState, newState) {
    const visibleItems = getVisibleItems(newState.items, newState.minLineY, newState.maxLineY)
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
