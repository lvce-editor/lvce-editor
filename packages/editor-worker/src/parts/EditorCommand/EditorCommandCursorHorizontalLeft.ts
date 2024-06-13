// @ts-ignore
import * as Editor from '../Editor/Editor.ts'
// @ts-ignore
import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.ts'
import * as EditorGetPositionLeft from './EditorCommandGetPositionLeft.ts'

const getNewSelections = (selections, lines, getDelta) => {
  const newSelections = new Uint32Array(selections.length)
  for (let i = 0; i < selections.length; i += 4) {
    const [selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn] = GetSelectionPairs.getSelectionPairs(selections, i)
    if (selectionStartRow === selectionEndRow && selectionStartColumn === selectionEndColumn) {
      if (selectionStartRow === 0 && selectionStartColumn === 0) {
        newSelections[i] = 0
        newSelections[i + 1] = 0
        newSelections[i + 2] = 0
        newSelections[i + 3] = 0
      } else {
        EditorGetPositionLeft.moveToPositionLeft(newSelections, i, selectionStartRow, selectionStartColumn, lines, getDelta)
        EditorGetPositionLeft.moveToPositionLeft(newSelections, i + 2, selectionStartRow, selectionStartColumn, lines, getDelta)
      }
    } else {
      EditorGetPositionLeft.moveRangeToPosition(newSelections, i, selections[i], selections[i + 1])
    }
  }
  return newSelections
}

export const editorCursorHorizontalLeft = (editor, getDelta) => {
  const { lines, selections } = editor
  const newSelections = getNewSelections(selections, lines, getDelta)
  return Editor.scheduleSelections(editor, newSelections)
}
