import * as Editor from '../Editor/Editor.js'
import * as EditorSelection from '../EditorSelection/EditorSelection.js'

const moveSelectionDown = (
  selections,
  i,
  selectionStartRow,
  selectionStartColumn,
  selectionEndRow,
  selectionEndColumn
) => {
  EditorSelection.moveRangeToPosition(
    selections,
    i,
    selectionEndRow + 1,
    selectionEndColumn
  )
}

const getNewSelections = (selections) => {
  return EditorSelection.map(selections, moveSelectionDown)
}

export const editorCursorsDown = (editor) => {
  const selections = editor.selections
  const newSelections = getNewSelections(selections)
  return Editor.scheduleSelections(editor, newSelections)
}
