import * as Assert from '../Assert/Assert.ts'
import * as Editor from '../Editor/Editor.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'
// TODO handle multiline selection
// TODO handle multiple cursors

export const copyLineDown = (editor) => {
  const { selections, primarySelectionIndex } = editor
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
