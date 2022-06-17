import * as Editor from '../Editor/Editor.js'
import * as TextDocument from '../TextDocument/TextDocument.js'

export const editorInsertLineBreak = (editor) => {
  const changes = []
  const lines = editor.lines
  for (const selection of editor.selections) {
    if (selection.start === selection.end) {
      const line = lines[selection.start.rowIndex].slice(
        0,
        selection.start.columnIndex
      )
      const indent = TextDocument.getIndent(line)
      changes.push({
        start: selection.start,
        end: selection.end,
        inserted: ['', indent],
        deleted: TextDocument.getSelectionText(editor, selection),
        origin: 'insertLineBreak',
      })
    } else {
      changes.push({
        start: selection.start,
        end: selection.end,
        inserted: ['', ''],
        deleted: TextDocument.getSelectionText(editor, selection),
        origin: 'insertLineBreak',
      })
    }
  }
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
