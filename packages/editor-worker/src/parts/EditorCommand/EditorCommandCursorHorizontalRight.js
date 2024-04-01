// @ts-ignore
import * as Editor from '../Editor/Editor.js'
// @ts-ignore
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

export const editorCursorHorizontalRight = (editor, getDelta) => {
  const { lines, selections } = editor
  const newSelections = getNewSelections(selections, lines, getDelta)
  return Editor.scheduleSelections(editor, newSelections)
}
