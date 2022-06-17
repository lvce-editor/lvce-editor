import * as Editor from '../Editor/Editor.js'

export const editorIndentLess = (editor) => {
  const changes = []
  const rowsToIndentLess = []
  for (const selection of editor.selections) {
    for (let i = selection.start.rowIndex; i <= selection.end.rowIndex; i++) {
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
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
