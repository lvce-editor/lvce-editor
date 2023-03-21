import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'

export const handleScrollBarHorizontalMove = (state, eventX) => {
  const { x, deltaX, width, finalDeltaY, height, scrollBarHeight, longestLineWidth } = state
  if (width > longestLineWidth) {
    return {
      ...state,
      deltaX: 0,
      scrollBarWidth: 0,
    }
  }
  const relativeX = eventX - x
  const scrollBarWidth = ScrollBarFunctions.getScrollBarWidth(width, longestLineWidth)
  const finalDeltaX = width - scrollBarWidth
  const currentScrollBarX = ScrollBarFunctions.getScrollBarOffset(deltaX, finalDeltaX, width, scrollBarWidth)
  const diff = relativeX - currentScrollBarX
  console.log({ eventX, deltaX })
  return {
    ...state,
    deltaX: eventX,
  }
}
