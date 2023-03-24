import * as Clamp from '../Clamp/Clamp.js'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'

const getNewPercent = (size, scrollBarSize, relativeX) => {
  if (relativeX <= 0) {
    return 0
  }
  // if (relativeY <= editor.scrollBarHeight / 2) {
  //   console.log('clicked at top')
  //   // clicked at top
  //   return 0
  // }
  if (relativeX <= size - scrollBarSize / 2) {
    // clicked in middle
    return relativeX / (size - scrollBarSize)
  }
  // clicked at bottom
  return 1
}

export const handleScrollBarHorizontalMove = (state, eventX) => {
  const { x, width, longestLineWidth, handleOffsetX } = state
  const spaceRight = 20 // TODO make this configurable
  const normalizedEventX = Clamp.clamp(eventX, x, x + width)
  if (width > longestLineWidth) {
    return {
      ...state,
      deltaX: 0,
      scrollBarWidth: 0,
    }
  }
  const relativeX = normalizedEventX - x - handleOffsetX
  const scrollBarWidth = ScrollBarFunctions.getScrollBarWidth(width, longestLineWidth)
  const finalDeltaX = longestLineWidth - width + spaceRight
  const newPercent = getNewPercent(width, scrollBarWidth, relativeX)
  const clampedPercent = Clamp.clamp(newPercent, 0, 1)
  const newDeltaX = clampedPercent * finalDeltaX
  return {
    ...state,
    deltaX: newDeltaX,
  }
}
