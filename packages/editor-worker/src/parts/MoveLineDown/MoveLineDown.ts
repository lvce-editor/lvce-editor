import * as TextDocument from '../TextDocument/TextDocument.ts'
import * as Editor from '../Editor/Editor.ts'

// TODO move cursor
// TODO multiple cursors -> vscode removes multiple cursors
// TODO with selection -> vscode moves whole selection
export const moveLineDown = (editor: any) => {
  const rowIndex = editor.cursor.rowIndex
  if (rowIndex === editor.lines.length - 1) {
    return
  }
  const documentEdits = [
    {
      type: /* splice */ 2,
      rowIndex: rowIndex,
      count: 2,
      newLines: [TextDocument.getLine(editor.textDocument, rowIndex + 1), TextDocument.getLine(editor.textDocument, rowIndex)],
    },
  ]
  // @ts-ignore
  const cursorEdits = Editor.moveCursors(editor, (editor, cursor) => {
    return {
      rowIndex: cursor.rowIndex + 1,
      columnIndex: cursor.columnIndex,
    }
  })
  // @ts-ignore
  Editor.scheduleDocumentAndCursors(editor, documentEdits, cursorEdits)
}
