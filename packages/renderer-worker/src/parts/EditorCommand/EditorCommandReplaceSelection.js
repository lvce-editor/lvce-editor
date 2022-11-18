import * as TextDocument from '../TextDocument/TextDocument.js'

export const editorReplaceSelections = (editor, replacement, origin) => {
  const changes = []
  const { selections } = editor
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
