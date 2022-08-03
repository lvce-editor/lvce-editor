import * as EditorCursorVertical from '../EditorCommandCursorVertical/EditorCommandCursorVertical.js'

const getEdgePosition = (editor) => {
  return {
    rowIndex: 0,
    columnIndex: 0,
  }
}

const getPosition = (selection) => {
  return selection.start
}

export const editorCursorsUp = (editor) => {
  return EditorCursorVertical.editorCommandCursorVertical(
    editor,
    getPosition,
    getEdgePosition,
    -1
  )
}
