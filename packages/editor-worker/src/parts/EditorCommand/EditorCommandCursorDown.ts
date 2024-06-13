// @ts-ignore
import * as Editor from '../Editor/Editor.ts'
// @ts-ignore
import * as EditorSelection from '../EditorSelection/EditorSelection.ts'

// @ts-ignore
const moveSelectionDown = (selections, i, selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn) => {
  EditorSelection.moveRangeToPosition(selections, i, selectionEndRow + 1, selectionEndColumn)
}

// @ts-ignore
const getNewSelections = (selections) => {
  return EditorSelection.map(selections, moveSelectionDown)
}

// @ts-ignore
export const cursorDown = (editor) => {
  const selections = editor.selections
  const newSelections = getNewSelections(selections)
  return Editor.scheduleSelections(editor, newSelections)
}
