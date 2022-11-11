import * as TextDocument from '../TextDocument/TextDocument.js'
import * as Editor from '../Editor/Editor.js'

export const copyLineUp = (editor) => {
  const rowIndex = editor.cursor.rowIndex
  const changes = [
    {
      start: editor.cursor,
      end: editor.cursor,
      inserted: [TextDocument.getLine(editor.textDocument, rowIndex), ''],
      deleted: [''],
    },
  ]
  Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
