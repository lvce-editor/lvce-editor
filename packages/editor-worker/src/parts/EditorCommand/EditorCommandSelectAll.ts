// @ts-ignore
import * as Editor from '../Editor/Editor.ts'
// @ts-ignore
import * as EditorSelection from '../EditorSelection/EditorSelection.ts'

export const selectAll = (editor) => {
  const lines = editor.lines
  const startRowIndex = 0
  const startColumnIndex = 0
  const endRowIndex = lines.length - 1
  const endColumnIndex = lines.at(-1).length
  const newSelections = EditorSelection.fromRange(startRowIndex, startColumnIndex, endRowIndex, endColumnIndex)
  return Editor.scheduleSelections(editor, newSelections)
}
