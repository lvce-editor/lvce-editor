import * as Editor from '../Editor/Editor.js'
import * as EditorSelection from '../EditorSelection/EditorSelection.js'

export const editorCancelSelection = (editor) => {
  const selections = editor.selections
  if (
    selections.length === 4 &&
    selections[0] === selections[2] &&
    selections[1] === selections[3]
  ) {
    return editor
  }
  const newSelections = EditorSelection.alloc(4)
  EditorSelection.moveRangeToPosition(
    newSelections,
    0,
    selections[0],
    selections[1]
  )
  return Editor.scheduleSelections(editor, newSelections)
}
