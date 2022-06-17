import * as Editor from '../Editor/Editor.js'
import * as TextDocument from '../TextDocument/TextDocument.js'

// const getIndent =
// TODO rename to insertSnippet
// TODO handle snippet tabstops and cursors $0 -> becomes cursor
export const editorSnippet = (editor, snippet) => {
  // TODO verify that deleted fits in the line
  const insertedLines = snippet.inserted.split('\n')
  const changes = []
  for (const selection of editor.selections) {
    if (insertedLines.length > 1) {
      const line = TextDocument.getLine(editor, selection.start.rowIndex)
      const indent = TextDocument.getIndent(line)
      const insertedLinesHere = [
        insertedLines[0],
        ...insertedLines.slice(1).map((line) => indent + line),
      ]
      console.log({ insertedLinesHere })
      changes.push({
        start: {
          rowIndex: selection.start.rowIndex,
          columnIndex: selection.start.columnIndex - snippet.deleted,
        },
        end: selection.end,
        inserted: insertedLinesHere,
        deleted: [''],
        origin: 'editorSnippet',
      })
    } else {
      changes.push({
        start: {
          rowIndex: selection.start.rowIndex,
          columnIndex: selection.start.columnIndex - snippet.deleted,
        },
        end: selection.end,
        inserted: insertedLines,
        deleted: [''],
        origin: 'editorSnippet',
      })
    }
  }
  console.log(JSON.stringify(changes, null, 2))
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
