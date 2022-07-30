import * as Editor from '../Editor/Editor.js'
import * as EditorGetPositionRight from './EditorCommandGetPositionRight.js'

const getNewSelections = (selections, lines, getDelta) => {
  const newSelections = new Uint32Array(selections.length)
  for (let i = 0; i < selections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionStartColumn = selections[i + 1]
    const selectionEndRow = selections[i + 2]
    const selectionEndColumn = selections[i + 3]
    if (
      selectionStartRow === selectionEndRow &&
      selectionStartColumn === selectionEndColumn
    ) {
      EditorGetPositionRight.moveToPositionRight(
        newSelections,
        i,
        selectionStartRow,
        selectionStartColumn,
        lines,
        getDelta
      )
    } else {
      newSelections[i] = newSelections[i + 2] = selections[i + 2]
      newSelections[i + 1] = newSelections[i + 3] = selections[i + 3]
    }
  }
  return newSelections
}

export const editorCursorHorizontalRight = (editor, getDelta) => {
  const lines = editor.lines
  const selections = editor.selections
  const newSelections = getNewSelections(selections, lines, getDelta)
  return Editor.scheduleSelections(editor, newSelections)
}
