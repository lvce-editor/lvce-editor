import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'

// TODO duplicate code with vertical pointer down event listener

export const handleScrollBarHorizontalPointerDown = (state, eventX) => {
  const { x, deltaX, width, finalDeltaY, height, scrollBarHeight, longestLineWidth } = state
  const relativeX = eventX - x
  const scrollBarWidth = ScrollBarFunctions.getScrollBarWidth(width, longestLineWidth)
  const finalDeltaX = width - scrollBarWidth
  const currentScrollBarX = ScrollBarFunctions.getScrollBarOffset(deltaX, finalDeltaX, width, scrollBarWidth)
  const diff = relativeX - currentScrollBarX
  // console.log({ diff })
  if (diff >= 0 && diff < scrollBarWidth) {
    // console.log('inside')
    return {
      ...state,
      handleOffsetX: diff,
    }
  }
  const { percent, handleOffset } = ScrollBarFunctions.getNewDeltaPercent(width, scrollBarWidth, relativeX)
  const newDeltaX = percent * finalDeltaX
  // console.log({ eventX })
  return {
    ...state,
    handleOffsetX: handleOffset,
    deltaX: newDeltaX,
  }
}
