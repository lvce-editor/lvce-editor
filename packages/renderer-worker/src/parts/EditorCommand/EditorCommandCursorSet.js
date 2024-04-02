import * as Editor from '../Editor/Editor.js'
import * as Assert from '../Assert/Assert.ts'
import * as EditorSelection from '../EditorSelection/EditorSelection.js'

export const cursorSet = (editor, rowIndex, columnIndex) => {
  Assert.object(editor)
  Assert.number(rowIndex)
  Assert.number(columnIndex)
  const selectionEdits = EditorSelection.fromRange(rowIndex, columnIndex, rowIndex, columnIndex)
  return Editor.scheduleSelections(editor, selectionEdits)
}
