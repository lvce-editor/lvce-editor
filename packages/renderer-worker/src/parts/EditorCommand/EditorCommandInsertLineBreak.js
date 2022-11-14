import * as Editor from '../Editor/Editor.js'
import * as EditOrigin from '../EditOrigin/EditOrigin.js'
import * as TextDocument from '../TextDocument/TextDocument.js'

const getChanges = (lines, selections) => {
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
    const range = {
      start,
      end,
    }
    if (
      selectionStartRow === selectionEndRow &&
      selectionStartColumn === selectionEndColumn
    ) {
      const line = lines[selectionStartRow].slice(0, selectionStartColumn)
      const indent = TextDocument.getIndent(line)
      changes.push({
        start: start,
        end: end,
        inserted: ['', indent],
        deleted: TextDocument.getSelectionText({ lines }, range),
        origin: EditOrigin.InsertLineBreak,
      })
    } else {
      changes.push({
        start: start,
        end: end,
        inserted: ['', ''],
        deleted: TextDocument.getSelectionText({ lines }, range),
        origin: EditOrigin.InsertLineBreak,
      })
    }
  }
  return changes
}

export const insertLineBreak = (editor) => {
  const lines = editor.lines
  const selections = editor.selections
  const changes = getChanges(lines, selections)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
