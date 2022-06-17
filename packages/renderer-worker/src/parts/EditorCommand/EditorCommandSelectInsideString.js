import * as Editor from '../Editor/Editor.js'

const findStringRange = (lines, range) => {
  if (range.start !== range.end) {
    return range
  }
  const rowIndex = range.start.rowIndex
  let startColumnIndex = range.start.columnIndex
  let endColumnIndex = range.end.columnIndex
  const line = lines[rowIndex]
  const quoteFound = false
  while (startColumnIndex > 0 && line[startColumnIndex] !== '"') {
    startColumnIndex--
  }
  startColumnIndex++
  while (endColumnIndex < line.length && line[endColumnIndex] !== '"') {
    endColumnIndex++
  }
  return {
    start: {
      rowIndex,
      columnIndex: startColumnIndex,
    },
    end: {
      rowIndex,
      columnIndex: endColumnIndex,
    },
  }
}

export const editorSelectInsideString = (editor) => {
  const newSelections = []
  for (const selection of editor.selections) {
    // TODO find string range, possibly use tokenizer
    const newSelection = findStringRange(editor.lines, selection)
    newSelections.push(newSelection)
  }
  return Editor.scheduleSelections(editor, newSelections)
}
