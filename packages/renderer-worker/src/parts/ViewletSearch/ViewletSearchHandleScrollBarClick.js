// TODO duplicate code with extensions list

import { setDeltaY } from './ViewletSearchSetDeltaY.js'

const getNewDeltaPercent = (state, relativeY) => {
  // TODO duplicate code with editor scrolling
  const { scrollBarHeight, height } = state
  if (relativeY <= scrollBarHeight / 2) {
    // clicked at top
    return 0
  }
  if (relativeY <= height - scrollBarHeight / 2) {
    // clicked in middle
    return (relativeY - scrollBarHeight / 2) / (height - scrollBarHeight)
  }
  // clicked at bottom
  return 1
}

export const handleScrollBarClick = (state, y) => {
  const { top, headerHeight, finalDeltaY, scrollBarHeight } = state
  const relativeY = y - top - headerHeight
  const newPercent = getNewDeltaPercent(state, relativeY)
  const newDeltaY = newPercent * finalDeltaY

  return {
    ...setDeltaY(state, newDeltaY),
    handleOffset: scrollBarHeight / 2,
  }
}
