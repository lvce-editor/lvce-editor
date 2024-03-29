import * as GetCompletionItemsVirtualDom from '../GetCompletionItemsVirtualDom/GetCompletionItemsVirtualDom.js'
import * as GetVisibleCompletionItems from '../GetVisibleCompletionItems/GetVisibleCompletionItems.js'
import * as RenderMethod from '../RenderMethod/RenderMethod.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'

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
    const visibleItems = GetVisibleCompletionItems.getVisibleItems(
      newState.items,
      newState.itemHeight,
      newState.leadingWord,
      newState.minLineY,
      newState.maxLineY,
      newState.focusedIndex,
    )
    const dom = GetCompletionItemsVirtualDom.getCompletionItemsVirtualDom(visibleItems)
    return ['setDom', dom]
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

const renderHeight = {
  isEqual(oldState, newState) {
    return oldState.items.length === newState.items.length
  },
  apply(oldState, newState) {
    const { itemHeight } = newState
    const contentHeight = newState.items.length * itemHeight
    return [/* method */ RenderMethod.SetContentHeight, /* contentHeight */ contentHeight]
  },
}

const renderNegativeMargin = {
  isEqual(oldState, newState) {
    return oldState.deltaY === newState.deltaY
  },
  apply(oldState, newState) {
    return [/* method */ RenderMethod.SetNegativeMargin, /* negativeMargin */ -newState.deltaY]
  },
}

const renderScrollBar = {
  isEqual(oldState, newState) {
    return (
      oldState.negativeMargin === newState.negativeMargin &&
      oldState.deltaY === newState.deltaY &&
      oldState.height === newState.height &&
      oldState.finalDeltaY === newState.finalDeltaY &&
      oldState.items.length === newState.items.length
    )
  },
  apply(oldState, newState) {
    const total = newState.items.length
    const contentHeight = total * newState.itemHeight
    const scrollBarHeight = ScrollBarFunctions.getScrollBarSize(newState.height, contentHeight, newState.minimumSliderSize)
    const scrollBarY = ScrollBarFunctions.getScrollBarY(
      newState.deltaY,
      newState.finalDeltaY,
      newState.height - newState.headerHeight,
      scrollBarHeight,
    )
    return [/* method */ RenderMethod.SetScrollBar, /* scrollBarY */ scrollBarY, /* scrollBarHeight */ scrollBarHeight]
  },
}

export const render = [renderItems, renderBounds, renderHeight, renderNegativeMargin, renderScrollBar]
