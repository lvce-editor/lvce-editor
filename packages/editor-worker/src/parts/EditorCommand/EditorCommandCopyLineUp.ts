// @ts-ignore
import * as TextDocument from '../TextDocument/TextDocument.ts'
// @ts-ignore
import * as Editor from '../Editor/Editor.ts'

// @ts-ignore
export const copyLineUp = (editor) => {
  const { selections, primarySelectionIndex } = editor
  const rowIndex = selections[primarySelectionIndex]
  const position = {
    rowIndex: rowIndex,
    columnIndex: 0,
  }
  const changes = [
    {
      start: position,
      end: position,
      inserted: [TextDocument.getLine(editor, rowIndex), ''],
      deleted: [''],
    },
  ]
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
