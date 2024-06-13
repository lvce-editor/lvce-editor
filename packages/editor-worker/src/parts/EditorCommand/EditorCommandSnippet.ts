// @ts-ignore
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
// @ts-ignore
import * as Editor from '../Editor/Editor.ts'
// @ts-ignore
import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'
// @ts-ignore
import * as TextDocument from '../TextDocument/TextDocument.ts'

const getChanges = (lines, selections, snippet) => {
  // TODO verify that deleted fits in the line
  const insertedLines = SplitLines.splitLines(snippet.inserted)
  const changes = []
  const selectionChanges = []
  for (let i = 0; i < selections.length; i += 4) {
    const [selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn] = GetSelectionPairs.getSelectionPairs(selections, i)
    if (insertedLines.length > 1) {
      const line = TextDocument.getLine({ lines }, selectionStartRow)
      const indent = TextDocument.getIndent(line)
      const insertedLinesHere = [insertedLines[0], ...insertedLines.slice(1).map((line) => indent + line)]
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
        // @ts-ignore
        selectionEndColumn + lastInsertedLine.length,
        selectionEndRow + insertedLines.length - deleted.length,
        // @ts-ignore
        selectionEndColumn + lastInsertedLine.length,
      )
    } else {
      const line = insertedLines[0]
      const placeholderIndex = line.indexOf('$0')
      if (placeholderIndex === -1) {
        const cursorColumnIndex = selectionStartColumn - snippet.deleted
        selectionChanges.push(selectionStartRow, cursorColumnIndex, selectionStartRow, cursorColumnIndex)
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
      } else {
        const inserted = line.replace('$0', '')
        const cursorColumnIndex = selectionEndColumn + 2
        selectionChanges.push(selectionStartRow, cursorColumnIndex, selectionStartRow, cursorColumnIndex)
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
  const { lines, selections } = editor
  const { changes, selectionChanges } = getChanges(lines, selections, snippet)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes, selectionChanges)
}
