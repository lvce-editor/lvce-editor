import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'
import * as Clamp from '../Clamp/Clamp.js'

const getNewPercent = (size, scrollBarSize, relativeX) => {
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
  const { x, deltaX, width, finalDeltaY, height, scrollBarHeight, longestLineWidth } = state
  const normalizedEventX = Clamp.clamp(eventX, x, x + width)
  if (width > longestLineWidth) {
    return {
      ...state,
      deltaX: 0,
      scrollBarWidth: 0,
    }
  }
  const relativeX = normalizedEventX - x
  const scrollBarWidth = ScrollBarFunctions.getScrollBarWidth(width, longestLineWidth)
  const finalDeltaX = longestLineWidth - (width - scrollBarWidth)
  const currentScrollBarX = ScrollBarFunctions.getScrollBarOffset(deltaX, finalDeltaX, width, scrollBarWidth)
  const newPercent = getNewPercent(width, scrollBarWidth, relativeX)
  const diff = relativeX - currentScrollBarX
  const newDeltaX = newPercent * finalDeltaX
  return {
    ...state,
    deltaX: newDeltaX,
  }
}
