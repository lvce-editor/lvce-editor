// @ts-ignore
import * as Editor from '../Editor/Editor.ts'
// @ts-ignore
import * as EditorSelection from '../EditorSelection/EditorSelection.ts'

// @ts-ignore
export const cancelSelection = (editor) => {
  const selections = editor.selections
  if (selections.length === 4 && selections[0] === selections[2] && selections[1] === selections[3]) {
    return editor
  }
  const newSelections = EditorSelection.alloc(4)
  EditorSelection.moveRangeToPosition(newSelections, 0, selections[0], selections[1])
  return Editor.scheduleSelections(editor, newSelections)
}
