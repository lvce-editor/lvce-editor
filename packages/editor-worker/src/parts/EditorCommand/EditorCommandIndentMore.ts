// @ts-ignore
import * as Editor from '../Editor/Editor.ts'
// @ts-ignore
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'

const getChanges = (selections) => {
  const rowsToIndent: any[] = []
  for (let i = 0; i < selections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionEndRow = selections[i + 2]
    for (let i = selectionStartRow; i <= selectionEndRow; i++) {
      rowsToIndent.push(i)
    }
  }
  const changes: any[] = []
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
