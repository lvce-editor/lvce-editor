// @ts-ignore
import * as Editor from '../Editor/Editor.ts'
// @ts-ignore
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.ts'

// TODO scrollbar position can be in interval [0, editor.height - editor.scrollBarHeight]
// when clicked at y <= editor.scrollbarHeight/2, position is set to zero
// when clicked at y >= editor.height - editor.scrollBarHeight/2, position is set to (editor.height - scrollBarHeight/2)
// when clicked at y > editor.height - editor.scrollBarHeight/2, position scrollbar at (y - scrollbarHeight/2)
// additionally, when clicked on scrollbar, scrollbar position shouldn't move

// @ts-ignore
export const handleScrollBarPointerDown = (state, eventY) => {
  const { y, deltaY, finalDeltaY, height, scrollBarHeight } = state
  const relativeY = eventY - y
  const currentScrollBarY = ScrollBarFunctions.getScrollBarY(deltaY, finalDeltaY, height, scrollBarHeight)
  const diff = relativeY - currentScrollBarY
  if (diff >= 0 && diff < scrollBarHeight) {
    return {
      ...state,
      handleOffset: diff,
    }
  }
  const { percent, handleOffset } = ScrollBarFunctions.getNewDeltaPercent(height, scrollBarHeight, relativeY)
  const newDeltaY = percent * finalDeltaY
  return {
    ...Editor.setDeltaYFixedValue(state, newDeltaY),
    handleOffset,
  }
}

export const handleScrollBarVerticalPointerDown = handleScrollBarPointerDown
