import * as EditorCursorVertical from './EditorCommandCursorVertical.js'

const getPosition = (selection) => {
  return selection.end
}

const getEdgePosition = (editor) => {
  return {
    rowIndex: editor.lines.length - 1,
    columnIndex: editor.lines[editor.lines.length - 1].length,
  }
}

export const editorCursorsDown = (editor) => {
  return EditorCursorVertical.editorCommandCursorVertical(
    editor,
    getPosition,
    getEdgePosition,
    1
  )
}
