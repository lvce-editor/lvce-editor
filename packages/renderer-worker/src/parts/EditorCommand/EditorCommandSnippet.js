import * as Editor from '../Editor/Editor.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as EditOrigin from '../EditOrigin/EditOrigin.js'

const getChanges = (lines, selections, snippet) => {
  // TODO verify that deleted fits in the line
  const insertedLines = snippet.inserted.split('\n')
  const changes = []
  const selectionChanges = []
  for (let i = 0; i < selections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionStartColumn = selections[i + 1]
    const selectionEndRow = selections[i + 2]
    const selectionEndColumn = selections[i + 3]
    if (insertedLines.length > 1) {
      const line = TextDocument.getLine({ lines }, selectionStartRow)
      const indent = TextDocument.getIndent(line)
      const insertedLinesHere = [
        insertedLines[0],
        ...insertedLines.slice(1).map((line) => indent + line),
      ]
      const deleted = ['']
      changes.push({
        start: {
          rowIndex: selectionStartRow,
          columnIndex: selectionStartColumn - snippet.deleted,
        },
        end: {
          rowIndex: selectionEndRow,
          columnIndex: selectionEndColumn,
        },
        inserted: insertedLinesHere,
        deleted,
        origin: EditOrigin.EditorSnippet,
      })
      const lastInsertedLine = insertedLines.at(-1)
      selectionChanges.push(
        selectionEndRow + insertedLines.length - deleted.length,
        selectionEndColumn + lastInsertedLine.length,
        selectionEndRow + insertedLines.length - deleted.length,
        selectionEndColumn + lastInsertedLine.length
      )
    } else {
      const line = insertedLines[0]
      const placeholderIndex = line.indexOf('$0')
      if (placeholderIndex !== -1) {
        const inserted = line.replace('$0', '')
        const cursorColumnIndex = selectionEndColumn + 2
        selectionChanges.push(
          selectionStartRow,
          cursorColumnIndex,
          selectionStartRow,
          cursorColumnIndex
        )
        changes.push({
          start: {
            rowIndex: selectionStartRow,
            columnIndex: selectionStartColumn - snippet.deleted,
          },
          end: {
            rowIndex: selectionEndRow,
            columnIndex: selectionEndColumn,
          },
          inserted: [inserted],
          deleted: [''],
          origin: EditOrigin.EditorSnippet,
        })
      } else {
        const cursorColumnIndex = selectionStartColumn - snippet.deleted
        selectionChanges.push(
          selectionStartRow,
          cursorColumnIndex,
          selectionStartRow,
          cursorColumnIndex
        )
        changes.push({
          start: {
            rowIndex: selectionStartRow,
            columnIndex: selectionStartColumn - snippet.deleted,
          },
          end: {
            rowIndex: selectionEndRow,
            columnIndex: selectionEndColumn,
          },
          inserted: insertedLines,
          deleted: [''],
          origin: EditOrigin.EditorSnippet,
        })
      }
    }
  }
  return { changes, selectionChanges: new Uint32Array(selectionChanges) }
}

// const getIndent =
// TODO rename to insertSnippet
// TODO handle snippet tabstops and cursors $0 -> becomes cursor
export const editorSnippet = (editor, snippet) => {
  // TODO verify that deleted fits in the line
  const lines = editor.lines
  const selections = editor.selections
  const { changes, selectionChanges } = getChanges(lines, selections, snippet)
  return Editor.scheduleDocumentAndCursorsSelections(
    editor,
    changes,
    selectionChanges
  )
}
