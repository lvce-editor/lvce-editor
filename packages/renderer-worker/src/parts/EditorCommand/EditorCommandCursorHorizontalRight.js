import * as Editor from '../Editor/Editor.js'
import * as GetEditorDeltaFunction from '../GetEditorDeltaFunction/GetEditorDeltaFunction.js'
import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.js'
import * as EditorGetPositionRight from './EditorCommandGetPositionRight.js'

const getNewSelections = (selections, lines, getDelta) => {
  const newSelections = new Uint32Array(selections.length)
  for (let i = 0; i < selections.length; i += 4) {
    const [selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn] = GetSelectionPairs.getSelectionPairs(selections, i)
    if (selectionStartRow === selectionEndRow && selectionStartColumn === selectionEndColumn) {
      EditorGetPositionRight.moveToPositionRight(newSelections, i, selectionStartRow, selectionStartColumn, lines, getDelta)
    } else {
      newSelections[i] = newSelections[i + 2] = selectionEndRow
      newSelections[i + 1] = newSelections[i + 3] = selectionEndColumn
    }
  }
  return newSelections
}

export const editorCursorHorizontalRight = (editor, deltaId) => {
  const { lines, selections } = editor
  const fn = GetEditorDeltaFunction.getEditorDeltaFunction(deltaId)
  const newSelections = getNewSelections(selections, lines, fn)
  return Editor.scheduleSelections(editor, newSelections)
}
