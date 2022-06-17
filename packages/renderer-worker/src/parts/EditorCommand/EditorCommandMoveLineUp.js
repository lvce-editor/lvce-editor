import * as TextDocument from '../TextDocument/TextDocument.js'
import * as Editor from '../Editor/Editor.js'

// TODO handle multiple cursors
export const editorMoveLineUp = (editor) => {
  const rowIndex = editor.cursor.rowIndex
  if (rowIndex === 0) {
    return
  }
  const documentEdits = [
    {
      type: /* splice */ 2,
      rowIndex: rowIndex - 1,
      count: 2,
      newLines: [
        TextDocument.getLine(editor.textDocument, rowIndex),
        TextDocument.getLine(editor.textDocument, rowIndex - 1),
      ],
    },
  ]
  const cursorEdits = Editor.moveCursors(editor, (editor, cursor) => {
    return {
      // TODO handle bottom 0
      rowIndex: cursor.rowIndex - 1,
      columnIndex: cursor.columnIndex,
    }
  })
  Editor.scheduleDocumentAndCursors(editor, documentEdits, cursorEdits)
}
