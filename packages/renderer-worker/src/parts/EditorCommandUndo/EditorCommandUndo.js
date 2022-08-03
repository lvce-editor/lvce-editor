import * as Editor from '../Editor/Editor.js'

const inverseChange = (edit) => {
  const endColumnIndex =
    edit.end.columnIndex - edit.deleted[0].length + edit.inserted[0].length
  return {
    start: edit.start,
    end: {
      rowIndex: edit.end.rowIndex,
      columnIndex: endColumnIndex,
    },
    inserted: edit.deleted,
    deleted: edit.inserted,
  }
}

export const editorUndo = (editor) => {
  if (editor.undoStack.length === 0) {
    return
  }
  const last = editor.undoStack.pop()
  const inverseChanges = last.map(inverseChange)
  Editor.scheduleDocumentAndCursorsSelections(editor, inverseChanges)
}
