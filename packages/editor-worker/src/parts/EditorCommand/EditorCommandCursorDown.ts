import * as Editor from '../Editor/Editor.ts'
import * as EditorSelection from '../EditorSelection/EditorSelection.ts'

const moveSelectionDown = (
  selections: any,
  i: any,
  selectionStartRow: any,
  selectionStartColumn: any,
  selectionEndRow: any,
  selectionEndColumn: any,
) => {
  EditorSelection.moveRangeToPosition(selections, i, selectionEndRow + 1, selectionEndColumn)
}

const getNewSelections = (selections: any) => {
  return EditorSelection.map(selections, moveSelectionDown)
}

export const cursorDown = (editor: any) => {
  const { selections } = editor
  const newSelections = getNewSelections(selections)
  return Editor.scheduleSelections(editor, newSelections)
}
