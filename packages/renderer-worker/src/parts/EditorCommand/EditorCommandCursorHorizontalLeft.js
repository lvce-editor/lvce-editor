import * as Editor from '../Editor/Editor.js'
import * as GetEditorDeltaFunction from '../GetEditorDeltaFunction/GetEditorDeltaFunction.js'
import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.js'
import * as EditorGetPositionLeft from './EditorCommandGetPositionLeft.js'

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

export const editorCursorHorizontalLeft = (editor, deltaId) => {
  const { lines, selections } = editor
  const fn = GetEditorDeltaFunction.getEditorDeltaFunction(deltaId)
  const newSelections = getNewSelections(selections, lines, fn)
  return Editor.scheduleSelections(editor, newSelections)
}
