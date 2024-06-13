import * as Editor from '../Editor/Editor.ts'

// @ts-ignore
const inverseChange = (edit) => {
  const endColumnIndex = edit.end.columnIndex - edit.deleted[0].length + edit.inserted[0].length
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

// @ts-ignore
export const undo = (state) => {
  const { undoStack } = state
  if (undoStack.length === 0) {
    return state
  }
  // TODO avoid side effect?
  const last = undoStack.pop()
  const inverseChanges = last.map(inverseChange)
  return Editor.scheduleDocumentAndCursorsSelectionIsUndo(state, inverseChanges)
}
