// @ts-ignore
import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.ts'
// @ts-ignore
import * as TextDocument from '../TextDocument/TextDocument.ts'

export const replaceRange = (editor, ranges, replacement, origin) => {
  const changes = []
  const rangesLength = ranges.length
  for (let i = 0; i < rangesLength; i += 4) {
    const [selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn] = GetSelectionPairs.getSelectionPairs(ranges, i)
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
