import * as Editor from '../Editor/Editor.js'
import * as TextDocument from '../TextDocument/TextDocument.js'

const getChanges = (lines, selections, snippet) => {
  // TODO verify that deleted fits in the line
  const insertedLines = snippet.inserted.split('\n')
  const changes = []
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
        deleted: [''],
        origin: 'editorSnippet',
      })
    } else {
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
        origin: 'editorSnippet',
      })
    }
  }
  return changes
}

// const getIndent =
// TODO rename to insertSnippet
// TODO handle snippet tabstops and cursors $0 -> becomes cursor
export const editorSnippet = (editor, snippet) => {
  // TODO verify that deleted fits in the line
  const lines = editor.lines
  const selections = editor.selections
  const changes = getChanges(lines, selections, snippet)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
