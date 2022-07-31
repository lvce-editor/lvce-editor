import * as Editor from '../Editor/Editor.js'

const getChanges = (selections) => {
  const changes = []
  const rowsToIndentLess = []
  for (let i = 0; i < selections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionEndRow = selections[i + 2]
    for (let i = selectionStartRow; i <= selectionEndRow; i++) {
      rowsToIndentLess.push(i)
    }
  }
  for (const rowToIndent of rowsToIndentLess) {
    changes.push({
      start: {
        rowIndex: rowToIndent,
        columnIndex: 0,
      },
      end: {
        rowIndex: rowToIndent,
        columnIndex: 2,
      },
      inserted: [''],
      deleted: ['  '],
      origin: 'indentLess',
    })
  }
  return changes
}

export const editorIndentLess = (editor) => {
  const selections = editor.selections
  const changes = getChanges(selections)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
