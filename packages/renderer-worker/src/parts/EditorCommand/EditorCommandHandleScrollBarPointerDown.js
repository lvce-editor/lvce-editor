import * as Editor from '../Editor/Editor.js'

// TODO scrollbar position can be in interval [0, editor.height - editor.scrollBarHeight]
// when clicked at y <= editor.scrollbarHeight/2, position is set to zero
// when clicked at y >= editor.height - editor.scrollBarHeight/2, position is set to (editor.height - scrollBarHeight/2)
// when clicked at y > editor.height - editor.scrollBarHeight/2, position scrollbar at (y - scrollbarHeight/2)
// additionally, when clicked on scrollbar, scrollbar position shouldn't move

const getNewDeltaPercent = (editor, relativeY) => {
  if (relativeY <= editor.scrollBarHeight / 2) {
    // clicked at top
    return 0
  }
  if (relativeY <= editor.height - editor.scrollBarHeight / 2) {
    // clicked in middle
    return (
      (relativeY - editor.scrollBarHeight / 2) /
      (editor.height - editor.scrollBarHeight)
    )
  }
  // clicked at bottom
  return 1
}

export const handleScrollBarPointerDown = (state, y) => {
  const { top, deltaY, finalDeltaY, height, scrollBarHeight } = state
  const relativeY = y - top
  const currentScrollBarY = (deltaY / finalDeltaY) * (height - scrollBarHeight)
  const diff = relativeY - currentScrollBarY
  if (diff >= 0 && diff < scrollBarHeight) {
    return {
      ...state,
      handleOffset: diff,
    }
  }
  const newPercent = getNewDeltaPercent(state, relativeY)
  // TODO
  const newHandleOffset = scrollBarHeight / 2
  // TODO when diff is greater, position scrollbar in the middle around cursor
  const newDeltaY = newPercent * finalDeltaY
  return {
    ...Editor.setDeltaYFixedValue(state, newDeltaY),
    handleOffset: newHandleOffset,
  }
}
