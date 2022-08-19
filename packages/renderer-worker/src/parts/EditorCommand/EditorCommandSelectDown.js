import * as Editor from '../Editor/Editor.js'

const getSelectUpChanges = (lines, selections) => {
  const max = lines.length - 1
  const newSelections = new Uint32Array(selections.length)
  for (let i = 0; i < selections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionStartColumn = selections[i + 1]
    const selectionEndRow = selections[i + 2]
    const selectionEndColumn = selections[i + 3]
    newSelections[i] = selectionStartRow
    newSelections[i + 1] = selectionStartColumn
    newSelections[i + 2] = Math.min(selectionEndRow + 1, max)
    newSelections[i + 3] = selectionEndColumn
  }
  return newSelections
}

export const selectDown = (editor) => {
  const { lines, selections } = editor
  const newSelections = getSelectUpChanges(lines, selections)
  return Editor.scheduleSelections(editor, newSelections)
}
