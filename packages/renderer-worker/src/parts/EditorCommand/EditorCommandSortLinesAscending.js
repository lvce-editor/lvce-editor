import * as TextDocument from '../TextDocument/TextDocument.js'
import * as Editor from '../Editor/Editor.js'

const compareLine = (a, b) => {
  return a.localeCompare(b)
}

const getSortedLines = (lines) => {
  const newLines = [...lines]
  newLines.sort(compareLine)
  return newLines
}

const origin = 'sort-lines-ascending'

const getSortLinesAscendingChanges = (lines, selections) => {
  const startRowIndex = selections[0]
  const startColumnIndex = selections[1]
  const endRowIndex = selections[2]
  const endColumnIndex = selections[3]
  const startRow = lines[startRowIndex]
  const endRow = lines[endRowIndex]
  const changes = []
  for (let i = 0; i < selections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionStartColumn = selections[i + 1]
    const selectionEndRow = selections[i + 2]
    const selectionEndColumn = selections[i + 3]
    const start = {
      rowIndex: selectionStartRow,
      columnIndex: selectionStartColumn,
    }
    const end = {
      rowIndex: selectionEndRow,
      columnIndex: selectionEndColumn,
    }
    const selection = {
      start,
      end,
    }
    const selectionLines = lines.slice(startRowIndex, endRowIndex + 1)
    const sortedSelectionLines = getSortedLines(selectionLines)
    changes.push({
      start: start,
      end: end,
      inserted: sortedSelectionLines,
      deleted: TextDocument.getSelectionText({ lines }, selection),
      origin,
    })
  }
  return changes
}

export const sortLinesAscending = (editor) => {
  const { lines, selections } = editor
  const changes = getSortLinesAscendingChanges(lines, selections)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
