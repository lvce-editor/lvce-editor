import * as Editor from '../Editor/Editor.js'

export const editorIndentMore = (editor) => {
  const changes = []
  const rowsToIndent = []
  for (const selection of editor.selections) {
    for (let i = selection.start.rowIndex; i <= selection.end.rowIndex; i++) {
      rowsToIndent.push(i)
    }
  }
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
      origin: 'indentMore',
    })
  }
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
