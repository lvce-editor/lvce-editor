import * as Editor from '../Editor/Editor.js'
import * as EditorSelection from '../EditorSelection/EditorSelection.js'

export const editorSelectAll = (editor) => {
  const lines = editor.lines
  const startRowIndex = 0
  const startColumnIndex = 0
  const endRowIndex = lines.length
  const endColumnIndex = lines.at(-1).length
  const newSelections = EditorSelection.fromRange(
    startRowIndex,
    startColumnIndex,
    endRowIndex,
    endColumnIndex
  )
  return Editor.scheduleSelections(editor, newSelections)
}
