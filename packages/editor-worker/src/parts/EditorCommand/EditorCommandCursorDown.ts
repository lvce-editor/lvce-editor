// @ts-ignore
import * as Editor from '../Editor/Editor.ts'
// @ts-ignore
import * as EditorSelection from '../EditorSelection/EditorSelection.js'

const moveSelectionDown = (selections, i, selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn) => {
  EditorSelection.moveRangeToPosition(selections, i, selectionEndRow + 1, selectionEndColumn)
}

const getNewSelections = (selections) => {
  return EditorSelection.map(selections, moveSelectionDown)
}

export const cursorDown = (editor) => {
  const selections = editor.selections
  const newSelections = getNewSelections(selections)
  return Editor.scheduleSelections(editor, newSelections)
}
