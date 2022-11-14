import * as Editor from '../Editor/Editor.js'
import * as EditOrigin from '../EditOrigin/EditOrigin.js'

const getChanges = (selections) => {
  const rowsToIndent = []
  for (let i = 0; i < selections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionEndRow = selections[i + 2]
    for (let i = selectionStartRow; i <= selectionEndRow; i++) {
      rowsToIndent.push(i)
    }
  }
  const changes = []
  for (const rowToIndent of rowsToIndent) {
    changes.push({
      start: {
        rowIndex: rowToIndent,
        columnIndex: 0,
      },
      end: {
        rowIndex: rowToIndent,
        columnIndex: 0,
      },
      inserted: ['  '],
      deleted: [''],
      origin: EditOrigin.IndentMore,
    })
  }
  return changes
}

export const indentMore = (editor) => {
  const selections = editor.selections
  const changes = getChanges(selections)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
