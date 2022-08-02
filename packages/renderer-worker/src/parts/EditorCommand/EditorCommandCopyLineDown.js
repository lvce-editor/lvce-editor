import * as TextDocument from '../TextDocument/TextDocument.js'
import * as Editor from '../Editor/Editor.js'
import * as Assert from '../Assert/Assert.js'
// TODO handle multiline selection
// TODO handle multiple cursors

export const editorCopyLineDown = (editor) => {
  const selections = editor.selections
  const primarySelectionIndex = editor.primarySelectionIndex
  const rowIndex = selections[primarySelectionIndex]
  Assert.number(rowIndex)
  const position = {
    rowIndex,
    columnIndex: 0,
  }
  const changes = [
    {
      inserted: [TextDocument.getLine(editor, rowIndex), ''],
      deleted: [''],
      start: position,
      end: position,
    },
  ]
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
