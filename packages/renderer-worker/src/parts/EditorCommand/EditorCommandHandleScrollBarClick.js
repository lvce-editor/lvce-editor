import * as Editor from '../Editor/Editor.js'

export const state = {
  /**
   * Offset at which scrollbar thumb has been clicked
   */
  handleOffset: 0,
}

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

export const editorHandleScrollBarClick = (editor, y) => {
  const relativeY = y - editor.top
  const currentScrollBarY =
    (editor.deltaY / editor.finalDeltaY) *
    (editor.height - editor.scrollBarHeight)
  const diff = relativeY - currentScrollBarY
  if (diff >= 0 && diff < editor.scrollBarHeight) {
    state.handleOffset = diff
    return editor
  }
  const newPercent = getNewDeltaPercent(editor, relativeY)
  // TODO
  state.handleOffset = editor.scrollBarHeight / 2
  // TODO when diff is greater, position scrollbar in the middle around cursor
  const newDeltaY = newPercent * editor.finalDeltaY
  return Editor.setDeltaYFixedValue(editor, newDeltaY)
}
