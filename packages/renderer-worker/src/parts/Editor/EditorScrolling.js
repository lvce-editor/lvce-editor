import * as Clamp from '../Clamp/Clamp.js'
import * as ScrollingFunctions from '../ScrollBarFunctions/ScrollBarFunctions.js'

// TODO this should be in a separate scrolling module
export const setDeltaY = (editor, value) => {
  const { finalDeltaY, deltaY, numberOfVisibleLines, height, scrollBarHeight } =
    editor
  const newDeltaY = Clamp.clamp(value, 0, finalDeltaY)
  if (deltaY === newDeltaY) {
    return editor
  }
  const newMinLineY = Math.floor(newDeltaY / 20)
  const newMaxLineY = newMinLineY + numberOfVisibleLines
  const scrollBarY = ScrollingFunctions.getScrollBarY(
    newDeltaY,
    finalDeltaY,
    height,
    scrollBarHeight
  )
  return {
    ...editor,
    minLineY: newMinLineY,
    maxLineY: newMaxLineY,
    deltaY: newDeltaY,
    scrollBarY,
  }
}
