import * as Assert from '../Assert/Assert.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const ITEM_HEIGHT = 62

export const create = (id, uri, left, top, width, height) => {
  return {
    items: [],
    focusedIndex: -1,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 0,
    width,
    height,
    negativeMargin: 0,
    scrollBarHeight: 0,
    handleOffset: 0,
    top,
    left,
    finalDeltaY: 2728,
  }
}

const getVisible = (state) => {
  return state.items.slice(state.minLineY, state.maxLineY)
}

export const loadContent = (state) => {
  return state
}

export const focusIndex = (state, index) => {
  if (index === -1) {
    return {
      ...state,
      focusedIndex: -1,
    }
  }
  const listHeight = state.height
  if (index < state.minLineY + 1) {
    // scroll up
    const minLineY = index
    const maxLineY = minLineY + Math.ceil(listHeight / ITEM_HEIGHT)
    const negativeMargin = -minLineY * ITEM_HEIGHT
    return {
      ...state,
      focusedIndex: index,
      minLineY,
      maxLineY,
      negativeMargin,
    }
  }
  if (index >= state.maxLineY - 1) {
    //  scroll down
    const maxLineY = index + 1
    const minLineY = maxLineY - Math.ceil(listHeight / ITEM_HEIGHT)
    const negativeMargin =
      -minLineY * ITEM_HEIGHT + (listHeight % ITEM_HEIGHT) - ITEM_HEIGHT
    return {
      ...state,
      focusedIndex: index,
      minLineY,
      maxLineY,
      negativeMargin,
    }
  }
  return {
    ...state,
    focusedIndex: index,
  }
}

// TODO lazyload this
export const handleClick = (state, index) => {
  return focusIndex(state, index)
}

export const focusNext = (state) => {
  if (state.focusedIndex === state.items.length - 1) {
    return state
  }
  return focusIndex(state, state.focusedIndex + 1)
}

export const focusNextPage = (state) => {
  if (state.focusedIndex === state.items.length - 1) {
    return state
  }
  const indexNextPage = Math.min(
    state.maxLineY + (state.maxLineY - state.minLineY) - 2,
    state.items.length - 1
  )
  return focusIndex(state, indexNextPage)
}

export const focusPrevious = (state) => {
  if (state.focusedIndex === 0 || state.focusedIndex === -1) {
    return state
  }
  return focusIndex(state, state.focusedIndex - 1)
}

export const focusPreviousPage = (state) => {
  if (state.focusedIndex === 0 || state.focusedIndex === -1) {
    return state
  }

  const indexPreviousPage = Math.max(
    state.minLineY - (state.maxLineY - state.minLineY) + 1,
    0
  )
  return focusIndex(state, indexPreviousPage)
}

export const focusFirst = (state) => {
  if (state.items.length === 0) {
    return state
  }
  return focusIndex(state, 0)
}

export const focusLast = (state) => {
  if (state.items.length === 0) {
    return state
  }
  return focusIndex(state, state.items.length - 1)
}

// TODO pass index instead
export const handleContextMenu = async (state, x, y, extensionId) => {
  // await Command.execute(
  //   /* ContextMenu.show */ 'ContextMenu.show',
  //   /* x */ x,
  //   /* y */ y,
  //   /* id */ 'manageExtension'
  // )
}

export const hasFunctionalResize = true

export const resize = (state, dimensions) => {
  // TODO should just return new state, render function can take old state and new state and return render commands
  const listHeight = dimensions.height
  const maxLineY = state.minLineY + Math.ceil(listHeight / ITEM_HEIGHT)
  return {
    ...state,
    ...dimensions,
    maxLineY,
  }
}

export const setDeltaY = (state, deltaY) => {
  Assert.object(state)
  Assert.number(deltaY)
  const listHeight = state.height
  if (deltaY < 0) {
    deltaY = 0
  } else if (deltaY > state.items.length * ITEM_HEIGHT - listHeight) {
    deltaY = Math.max(state.items.length * ITEM_HEIGHT - listHeight, 0)
  }
  if (state.deltaY === deltaY) {
    return state
  }
  // TODO when it only moves by one px, extensions don't need to be rerendered, only negative margin
  const minLineY = Math.floor(deltaY / ITEM_HEIGHT)
  const maxLineY = minLineY + Math.round(listHeight / ITEM_HEIGHT)
  const negativeMargin = -Math.round(deltaY)
  return {
    ...state,
    deltaY,
    minLineY,
    maxLineY,
    negativeMargin,
  }
  // await scheduleExtensions(state)
}

export const handleWheel = (state, deltaY) => {
  return setDeltaY(state, state.deltaY + deltaY)
}

const getNewPercent = (state, relativeY) => {
  if (relativeY <= state.height - state.scrollBarHeight / 2) {
    // clicked in middle
    return relativeY / (state.height - state.scrollBarHeight)
  }
  // clicked at bottom
  return 1
}

export const handleScrollBarMove = (state, y) => {
  const relativeY = y - state.top - state.handleOffset
  const newPercent = getNewPercent(state, relativeY)
  const newDeltaY = newPercent * state.finalDeltaY
  console.log({ relativeY, newPercent, newDeltaY })
  return setDeltaY(state, newDeltaY)
}

const getNewDeltaPercent = (state, relativeY) => {
  if (relativeY <= state.scrollBarHeight / 2) {
    // clicked at top
    return 0
  }
  if (relativeY <= state.height - state.scrollBarHeight / 2) {
    // clicked in middle
    return (
      (relativeY - state.scrollBarHeight / 2) /
      (state.height - state.scrollBarHeight)
    )
  }
  // clicked at bottom
  return 1
}

export const handleScrollBarClick = (state, y) => {
  const relativeY = y - state.top
  const newPercent = getNewDeltaPercent(state, relativeY)
  const newDeltaY = newPercent * state.finalDeltaY
  return {
    ...setDeltaY(state, newDeltaY),
    handleOffset: state.scrollBarHeight / 2,
  }
}

export const hasFunctionalRender = true

export const render = (oldState, newState) => {
  const changes = []
  if (
    oldState.items !== newState.items ||
    oldState.minLineY !== newState.minLineY ||
    oldState.maxLineY !== newState.maxLineY
  ) {
    const visibleItems = getVisible(newState)
    changes.push([
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'List',
      /* method */ 'setItems',
      /* visibleExtensions */ visibleItems,
    ])
  }
  if (oldState.items.length !== newState.items.length) {
    const contentHeight = newState.items.length * ITEM_HEIGHT
    changes.push([
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'List',
      /* method */ 'setContentHeight',
      /* contentHeight */ contentHeight,
    ])
  }

  if (oldState.negativeMargin !== newState.negativeMargin) {
    changes.push([
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'List',
      /* method */ 'setNegativeMargin',
      /* negativeMargin */ newState.negativeMargin,
    ])
  }

  if (oldState.focusedIndex !== newState.focusedIndex) {
    changes.push([
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'List',
      /* method */ 'setFocusedIndex',
      /* oldFocusedIndex */ oldState.focusedIndex - oldState.minLineY,
      /* newFocusedIndex */ newState.focusedIndex - newState.minLineY,
    ])
  }
  if (oldState.deltaY !== newState.deltaY) {
    const scrollBarY =
      (newState.deltaY / newState.finalDeltaY) *
      (newState.height - newState.scrollBarHeight)
    changes.push([
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ 'List',
      /* method */ 'setScrollBar',
      /* scrollBarY */ scrollBarY,
      /* scrollBarHeight */ newState.scrollBarHeight,
    ])
  }
  return changes
}
