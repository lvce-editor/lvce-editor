// @ts-ignore
import * as Editor from './Editor.ts'

// @ts-ignore
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
    // @ts-ignore
    const documentEdits = {
      rowIndex,
      count: 1,
      newLines: [lines[rowIndex].slice(0, columnIndex) + lines[rowIndex].slice(columnIndex)],
      type: /* splice */ 2,
    }
    // @ts-ignore
    const cursorEdit = {}
  }
}
