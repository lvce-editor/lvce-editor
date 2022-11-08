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

export const cursorsUp = (editor) => {
  return EditorCursorVertical.editorCommandCursorVertical(
    editor,
    getPosition,
    getEdgePosition,
    -1
  )
}
