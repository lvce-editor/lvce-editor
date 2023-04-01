import * as TextDocument from '../TextDocument/TextDocument.js'

export const replaceRange = (editor, ranges, replacement, origin) => {
  const changes = []
  const rangesLength = ranges.length
  for (let i = 0; i < rangesLength; i += 4) {
    const selectionStartRow = ranges[i]
    const selectionStartColumn = ranges[i + 1]
    const selectionEndRow = ranges[i + 2]
    const selectionEndColumn = ranges[i + 3]
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
    changes.push({
      start: start,
      end: end,
      inserted: replacement,
      deleted: TextDocument.getSelectionText(editor, selection),
      origin,
    })
  }
  return changes
}
