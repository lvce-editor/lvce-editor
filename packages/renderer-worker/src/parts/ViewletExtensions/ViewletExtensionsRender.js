import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'

const getVisible = (state) => {
  const { minLineY, maxLineY, items, itemHeight } = state
  const setSize = items.length
  const visible = []
  for (let i = minLineY; i < maxLineY; i++) {
    const item = items[i]
    visible.push({ ...item, setSize, posInSet: i + 1, top: i * itemHeight })
  }
  return visible
}

export const hasFunctionalRender = true

const renderExtensions = {
  isEqual(oldState, newState) {
    return oldState.items === newState.items && oldState.minLineY === newState.minLineY && oldState.maxLineY === newState.maxLineY
  },
  apply(oldState, newState) {
    // TODO render extensions incrementally when scrolling
    const visibleExtensions = getVisible(newState)
    return [/* method */ 'setExtensions', /* visibleExtensions */ visibleExtensions]
  },
}

const renderHeight = {
  isEqual(oldState, newState) {
    return oldState.items.length === newState.items.length
  },
  apply(oldState, newState) {
    const { itemHeight } = newState
    const contentHeight = newState.items.length * itemHeight
    return [/* method */ 'setContentHeight', /* contentHeight */ contentHeight]
  },
}

const renderNegativeMargin = {
  isEqual(oldState, newState) {
    return oldState.deltaY === newState.deltaY
  },
  apply(oldState, newState) {
    return [/* method */ 'setNegativeMargin', /* negativeMargin */ -newState.deltaY]
  },
}

const renderFocusedIndex = {
  isEqual(oldState, newState) {
    return oldState.focusedIndex === newState.focusedIndex && oldState.minLineY === newState.minLineY
  },
  apply(oldState, newState) {
    const oldFocusedIndex = oldState.focusedIndex - oldState.minLineY
    const newFocusedIndex = newState.focusedIndex - newState.minLineY
    return [
      /* method */ 'setFocusedIndex',
      /* oldFocusedIndex */ oldFocusedIndex,
      /* newFocusedIndex */ newFocusedIndex,
      /* focused */ newState.focused,
    ]
  },
}

const renderScrollBar = {
  isEqual(oldState, newState) {
    return (
      oldState.negativeMargin === newState.negativeMargin &&
      oldState.deltaY === newState.deltaY &&
      oldState.height === newState.height &&
      oldState.finalDeltaY === newState.finalDeltaY
    )
  },
  apply(oldState, newState) {
    const scrollBarY = ScrollBarFunctions.getScrollBarY(
      newState.deltaY,
      newState.finalDeltaY,
      newState.height - newState.headerHeight,
      newState.scrollBarHeight
    )
    return [/* method */ 'setScrollBar', /* scrollBarY */ scrollBarY, /* scrollBarHeight */ newState.scrollBarHeight]
  },
}

const renderMessage = {
  isEqual(oldState, newState) {
    return oldState.message === newState.message
  },
  apply(oldState, newState) {
    return [/* method */ 'setMessage', /* message */ newState.message]
  },
}

const renderSize = {
  isEqual(oldState, newState) {
    return oldState.size === newState.size
  },
  apply(oldState, newState) {
    return [/* method */ 'setSize', /* oldSize */ oldState.size, /* newSize */ newState.size]
  },
}

const renderSearchValue = {
  isEqual(oldState, newState) {
    return oldState.searchValue === newState.searchValue
  },
  apply(oldState, newState) {
    return [/* method */ 'setSearchValue', oldState.searchValue, newState.searchValue]
  },
}

export const render = [
  renderHeight,
  renderFocusedIndex,
  renderScrollBar,
  renderNegativeMargin,
  renderMessage,
  renderExtensions,
  renderSize,
  renderSearchValue,
]
