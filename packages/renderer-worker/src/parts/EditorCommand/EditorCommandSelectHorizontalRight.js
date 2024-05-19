import * as Editor from '../Editor/Editor.js'
import * as GetEditorDeltaFunction from '../GetEditorDeltaFunction/GetEditorDeltaFunction.js'
import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.js'

const getNewSelections = (selections, lines, getDelta) => {
  const newSelections = new Uint32Array(selections.length)
  for (let i = 0; i < selections.length; i += 4) {
    const [selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn] = GetSelectionPairs.getSelectionPairs(selections, i)
    const line = lines[selectionEndRow]
    newSelections[i] = selectionStartRow
    newSelections[i + 1] = selectionStartColumn
    if (selectionEndColumn >= line.length) {
      newSelections[i + 2] = selectionEndRow + 1
      newSelections[i + 3] = 0
    } else {
      const delta = getDelta(line, selectionEndColumn)
      newSelections[i + 2] = selectionEndRow
      newSelections[i + 3] = selectionEndColumn + delta
    }
  }
  return newSelections
}

export const editorSelectHorizontalRight = (editor, deltaId) => {
  const lines = editor.lines
  const selections = editor.selections
  const fn = GetEditorDeltaFunction.getEditorDeltaFunction(deltaId)
  const newSelections = getNewSelections(selections, lines, fn)
  return Editor.scheduleSelections(editor, newSelections)
}
