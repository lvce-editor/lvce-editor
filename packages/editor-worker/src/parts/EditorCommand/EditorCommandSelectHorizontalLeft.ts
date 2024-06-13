// @ts-ignore
import * as Editor from '../Editor/Editor.ts'
// @ts-ignore
import * as EditorSelection from '../EditorSelection/EditorSelection.ts'
// @ts-ignore
import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.ts'
import * as EditorGetPositionLeft from './EditorCommandGetPositionLeft.ts'

// TODO interleave cursors and selection
// then loop over selections
// apply edit
// if new range is empty -> add cursor
// else if new range is overlapping -> merge ranges
// else add cursor and selection

// @ts-ignore
const getNewSelections = (selections, lines, getDelta) => {
  const newSelections = EditorSelection.clone(selections)
  for (let i = 0; i < selections.length; i += 4) {
    // @ts-ignore
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

// @ts-ignore
export const editorSelectHorizontalLeft = (editor, getDelta) => {
  const { lines, selections } = editor
  const newSelections = getNewSelections(selections, lines, getDelta)
  return Editor.scheduleSelections(editor, newSelections)
}
