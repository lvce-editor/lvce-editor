import * as EditorCursorVertical from './EditorCommandCursorVertical.js'

const getEdgePosition = (editor) => {
  return {
    rowIndex: 0,
    columnIndex: 0,
  }
}

const getPosition = (selection) => {
  return selection.start
}

export const cursorUp = (editor) => {
  return EditorCursorVertical.cursorVertical(
    editor,
    getPosition,
    getEdgePosition,
    -1
  )
}
