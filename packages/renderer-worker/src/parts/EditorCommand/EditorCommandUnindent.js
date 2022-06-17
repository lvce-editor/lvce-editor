import * as Editor from '../Editor/Editor.js'

const INDENT = '  '

export const editorUnindent = (editor) => {
  if (Editor.hasSelection(editor)) {
    const documentEdits = []
    const cursorEdits = []
    const selectionEdits = []
    const canUnindentSelection = (selection) => {
      for (let i = selection.start.rowIndex; i <= selection.end.rowIndex; i++) {
        if (editor.lines[i].startsWith(INDENT)) {
          return true
        }
      }
      return false
    }
    // TODO replace check with flag that indicates whether change occurred
    // -> only iterate once over selection lines

    if (!editor.selections.some(canUnindentSelection)) {
      return
    }
    const indentLineMaybe = (rowIndex) => {
      if (editor.lines[rowIndex].startsWith(INDENT)) {
        documentEdits.push({
          type: /* singleLineEdit */ 1,
          rowIndex,
          columnIndex: INDENT.length,
          deleted: INDENT.length,
          inserted: '',
        })
      }
    }
    let previousRowIndex = -1
    for (const selection of editor.selections) {
      let startRowIndex = selection.start.rowIndex
      const endRowIndex = selection.end.rowIndex
      if (startRowIndex === previousRowIndex) {
        startRowIndex++
      }
      for (let i = startRowIndex; i <= endRowIndex; i++) {
        indentLineMaybe(i)
      }
      let start = selection.start
      let end = selection.end
      if (editor.lines[start.rowIndex].startsWith(INDENT)) {
        start = {
          rowIndex: start.rowIndex,
          columnIndex: Math.max(start.columnIndex - INDENT.length, 0),
        }
      }
      if (editor.lines[end.rowIndex].startsWith(INDENT)) {
        end = {
          rowIndex: end.rowIndex,
          columnIndex: Math.max(end.columnIndex - INDENT.length, 0),
        }
      }
      cursorEdits.push(end)
      selectionEdits.push({
        start,
        end,
      })
      previousRowIndex = endRowIndex
    }
    Editor.scheduleDocumentAndCursorsAndSelections(
      editor,
      documentEdits,
      cursorEdits,
      selectionEdits
    )
    return
  }
  const documentEdits = []
  const cursorEdits = []
  if (!editor.lines[editor.cursor.rowIndex].startsWith(INDENT)) {
    return
  }
  documentEdits.push({
    type: /* singleLineEdit */ 1,
    rowIndex: editor.cursor.rowIndex,
    inserted: '',
    columnIndex: 2,
    deleted: 2,
  })
  cursorEdits.push({
    rowIndex: editor.cursor.rowIndex,
    columnIndex: editor.cursor.columnIndex - 2,
  })
  Editor.scheduleDocumentAndCursors(editor, documentEdits, cursorEdits)
}
// const editor = {
//   textDocument: {
//     lines: ['  line 1'],
//   },
//   cursor: {
//     rowIndex: 0,
//     columnIndex: 8,
//   },
//   selections: [
//     {
//       start: {
//         rowIndex: 0,
//         columnIndex: 0,
//       },
//       end: {
//         rowIndex: 0,
//         columnIndex: 8,
//       },
//     },
//   ],
//   tokenizer: TokenizePlainText,
// }
// editorUnindent(editor)

// editor.lines //?
