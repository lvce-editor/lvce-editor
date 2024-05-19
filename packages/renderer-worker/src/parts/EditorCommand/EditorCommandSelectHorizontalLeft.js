import * as Editor from '../Editor/Editor.js'
import * as GetEditorDeltaFunction from '../GetEditorDeltaFunction/GetEditorDeltaFunction.js'
import * as EditorSelection from '../EditorSelection/EditorSelection.js'
import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.js'
import * as EditorGetPositionLeft from './EditorCommandGetPositionLeft.js'

// TODO interleave cursors and selection
// then loop over selections
// apply edit
// if new range is empty -> add cursor
// else if new range is overlapping -> merge ranges
// else add cursor and selection

const getNewSelections = (selections, lines, getDelta) => {
  const newSelections = EditorSelection.clone(selections)
  for (let i = 0; i < selections.length; i += 4) {
    const [selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn, reversed] = GetSelectionPairs.getSelectionPairs(
      selections,
      i,
    )
    if (selectionStartRow === selectionEndRow && selectionStartColumn === selectionEndColumn) {
      EditorGetPositionLeft.moveToPositionLeft(newSelections, i + 2, selectionStartRow, selectionStartColumn, lines, getDelta)
      EditorGetPositionLeft.moveToPositionEqual(newSelections, i, selectionEndRow, selectionEndColumn)
    } else {
      EditorGetPositionLeft.moveToPositionLeft(newSelections, i + 2, selectionStartRow, selectionStartColumn, lines, getDelta)
      EditorGetPositionLeft.moveToPositionEqual(newSelections, i, selectionEndRow, selectionEndColumn)
    }
  }
  return newSelections
}

export const editorSelectHorizontalLeft = (editor, deltaId) => {
  const { lines, selections } = editor
  const fn = GetEditorDeltaFunction.getEditorDeltaFunction(deltaId)
  const newSelections = getNewSelections(selections, lines, fn)
  return Editor.scheduleSelections(editor, newSelections)
}
