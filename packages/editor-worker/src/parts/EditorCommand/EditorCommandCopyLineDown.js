import * as Assert from '../Assert/Assert.js'
// @ts-ignore
import * as Editor from '../Editor/Editor.js'
// @ts-ignore
import * as TextDocument from '../TextDocument/TextDocument.js'
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
