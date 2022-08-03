import * as Editor from '../Editor/Editor.js'

export const editorDeleteHorizontalRight = (editor, getDelta) => {
  if (Editor.hasSelection(editor)) {
    return
  }
  const lines = editor.lines
  const rowIndex = editor.cursor.rowIndex
  const columnIndex = editor.cursor.columnIndex
  if (columnIndex >= lines[rowIndex].length) {
    if (rowIndex >= lines.length) {
      return
    }
    const documentEdits = {
      rowIndex,
      count: 1,
      newLines: [
        lines[rowIndex].slice(0, columnIndex) +
          lines[rowIndex].slice(columnIndex),
      ],
      type: /* splice */ 2,
    }
    const cursorEdit = {}
  }
}
