import * as Editor from '../Editor/Editor.js'

const getNewSelections = (lines, selections) => {
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
      const rowIndex = selectionStartRow
      let startColumnIndex = selectionStartColumn
      let endColumnIndex = selectionEndColumn
      const line = lines[rowIndex]
      const quoteFound = false
      while (startColumnIndex > 0 && line[startColumnIndex] !== '"') {
        startColumnIndex--
      }
      startColumnIndex++
      while (endColumnIndex < line.length && line[endColumnIndex] !== '"') {
        endColumnIndex++
      }
      newSelections[i] = rowIndex
      newSelections[i + 1] = startColumnIndex
      newSelections[i + 2] = rowIndex
      newSelections[i + 3] = endColumnIndex
    } else {
      newSelections[i] = selectionStartRow
      newSelections[i + 1] = selectionStartColumn
      newSelections[i + 2] = selectionEndRow
      newSelections[i + 3] = selectionEndColumn
    }
  }
  return newSelections
}

export const selectInsideString = (editor) => {
  const selections = editor.selections
  const lines = editor.lines
  const newSelections = getNewSelections(lines, selections)
  return Editor.scheduleSelections(editor, newSelections)
}
