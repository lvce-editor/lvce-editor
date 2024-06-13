// @ts-ignore
import * as Editor from '../Editor/Editor.ts'
// @ts-ignore
import * as GetLineComment from '../GetLineComment/GetLineComment.js'
// @ts-ignore
import * as TextDocument from '../TextDocument/TextDocument.js'

const RE_WHITESPACE_AT_START = /^\s+/

const getLineCommentEdit = (rowIndex, line, lineComment) => {
  const whitespaceMatch = line.match(RE_WHITESPACE_AT_START)
  const index = whitespaceMatch ? whitespaceMatch[0].length : 0
  if (line.slice(index).startsWith(lineComment)) {
    // TODO also check tab character
    if (line[index + lineComment.length] === ' ') {
      return {
        inserted: [''],
        deleted: [lineComment.length + 1],
        start: {
          rowIndex,
          columnIndex: index,
        },
        end: {
          rowIndex,
          columnIndex: index + lineComment.length + 1,
        },
        type: /* singleLineEdit */ 1,
      }
    }
    return {
      inserted: [''],
      deleted: [lineComment],
      start: {
        rowIndex,
        columnIndex: index,
      },
      end: {
        rowIndex,
        columnIndex: index + lineComment.length,
      },
      type: /* singleLineEdit */ 1,
    }
  }
  return {
    inserted: [`${lineComment} `],
    deleted: [],
    start: {
      rowIndex,
      columnIndex: index,
    },
    end: {
      rowIndex,
      columnIndex: index,
    },
    type: /* singleLineEdit */ 1,
  }
}

export const editorToggleLineComment = async (editor) => {
  const lineComment = await GetLineComment.getLineComment(editor)
  if (!lineComment) {
    return editor
  }
  const textDocument = editor
  const cursorRowIndex = editor.selections[0]
  const line = TextDocument.getLine(textDocument, cursorRowIndex)
  const documentEdits = [getLineCommentEdit(cursorRowIndex, line, lineComment)]
  return Editor.scheduleDocumentAndCursorsSelections(editor, documentEdits)
}
