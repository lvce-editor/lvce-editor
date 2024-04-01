// @ts-ignore
import * as Editor from '../Editor/Editor.js'
// @ts-ignore
import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.js'

const getSelectUpChanges = (lines, selections) => {
  const newSelections = new Uint32Array(selections.length)
  for (let i = 0; i < selections.length; i += 4) {
    const [selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn] = GetSelectionPairs.getSelectionPairs(selections, i)
    newSelections[i] = Math.max(selectionStartRow - 1, 0)
    newSelections[i + 1] = selectionStartColumn
    newSelections[i + 2] = selectionEndRow
    newSelections[i + 3] = selectionEndColumn
  }
  return newSelections
}

export const selectUp = (editor) => {
  const { lines, selections } = editor
  const newSelections = getSelectUpChanges(lines, selections)
  return Editor.scheduleSelections(editor, newSelections)
}
