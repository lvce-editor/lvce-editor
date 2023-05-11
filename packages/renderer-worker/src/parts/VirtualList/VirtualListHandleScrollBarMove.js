import { setDeltaY } from './VirtualListSetDeltaY.js'

const getNewPercent = (contentHeight, scrollBarHeight, relativeY) => {
  if (relativeY <= contentHeight - scrollBarHeight / 2) {
    // clicked in middle
    return relativeY / (contentHeight - scrollBarHeight)
  }
  // clicked at bottom
  return 1
}

export const handleScrollBarMove = (state, eventY) => {
  const { y, headerHeight, handleOffset, finalDeltaY, height, scrollBarHeight } = state
  const relativeY = eventY - y - headerHeight - handleOffset
  const contentHeight = height - headerHeight
  const newPercent = getNewPercent(contentHeight, scrollBarHeight, relativeY)
  const newDeltaY = newPercent * finalDeltaY
  return setDeltaY(state, newDeltaY)
}

export const handleScrollBarThumbPointerMove = handleScrollBarMove
