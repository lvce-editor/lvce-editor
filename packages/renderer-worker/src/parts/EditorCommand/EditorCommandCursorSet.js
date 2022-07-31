import * as Editor from '../Editor/Editor.js'
import * as Assert from '../Assert/Assert.js'
import * as EditorSelection from '../EditorSelection/EditorSelection.js'

export const editorCursorSet = (editor, rowIndex, columnIndex) => {
  Assert.object(editor)
  Assert.number(rowIndex)
  Assert.number(columnIndex)
  const selectionEdits = EditorSelection.fromRange(
    rowIndex,
    columnIndex,
    rowIndex,
    columnIndex
  )
  return Editor.scheduleSelections(editor, selectionEdits)
}
