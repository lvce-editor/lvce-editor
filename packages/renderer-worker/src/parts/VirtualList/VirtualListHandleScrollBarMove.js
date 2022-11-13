import { setDeltaY } from './VirtualListSetDeltaY.js'

const getNewPercent = (state, relativeY) => {
  if (relativeY <= state.height - state.scrollBarHeight / 2) {
    // clicked in middle
    return relativeY / (state.height - state.scrollBarHeight)
  }
  // clicked at bottom
  return 1
}

export const handleScrollBarMove = (state, y) => {
  const { top, headerHeight, handleOffset, finalDeltaY } = state
  const relativeY = y - top - headerHeight - handleOffset
  const newPercent = getNewPercent(state, relativeY)
  const newDeltaY = newPercent * finalDeltaY
  return setDeltaY(state, newDeltaY)
}
