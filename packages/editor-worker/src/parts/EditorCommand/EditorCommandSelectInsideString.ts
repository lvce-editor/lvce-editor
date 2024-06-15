import * as Editor from '../Editor/Editor.ts'
import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.ts'

const getNewSelections = (lines: readonly string[], selections: any) => {
  const newSelections = new Uint32Array(selections.length)
  for (let i = 0; i < selections.length; i += 4) {
    const [selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn] = GetSelectionPairs.getSelectionPairs(selections, i)
    if (selectionStartRow === selectionEndRow && selectionStartColumn === selectionEndColumn) {
      const rowIndex = selectionStartRow
      let startColumnIndex = selectionStartColumn
      let endColumnIndex = selectionEndColumn
      const line = lines[rowIndex]
      // @ts-ignore
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

export const selectInsideString = (editor: any) => {
  const selections = editor.selections
  const lines = editor.lines
  const newSelections = getNewSelections(lines, selections)
  return Editor.scheduleSelections(editor, newSelections)
}
