import * as Assert from '../Assert/Assert.ts'
import * as Editor from '../Editor/Editor.ts'
import * as EditorSelection from '../EditorSelection/EditorSelection.ts'

export const cursorSet = (editor: any, rowIndex: number, columnIndex: number) => {
  Assert.object(editor)
  Assert.number(rowIndex)
  Assert.number(columnIndex)
  const selectionEdits = EditorSelection.fromRange(rowIndex, columnIndex, rowIndex, columnIndex)
  return Editor.scheduleSelections(editor, selectionEdits)
}
