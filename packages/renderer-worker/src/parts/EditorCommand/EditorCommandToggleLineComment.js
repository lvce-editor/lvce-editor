import * as Editor from '../Editor/Editor.js'
import * as Languages from '../Languages/Languages.js'
import * as TextDocument from '../TextDocument/TextDocument.js'

// TODO
const getLanguageAtPosition = (position) => {
  return 'html'
}

const getLineComment = async (editor) => {
  const languageConfiguration = await Languages.getLanguageConfiguration(editor)
  if (
    !languageConfiguration ||
    !languageConfiguration.comments ||
    !languageConfiguration.comments.lineComment
  ) {
    return undefined
  }
  return languageConfiguration.comments.lineComment
}

const getBlockComment = async (languageId) => {
  const languageConfiguration = await Languages.getLanguageConfiguration(
    languageId
  )
  if (
    !languageConfiguration ||
    !languageConfiguration.comments ||
    !languageConfiguration.comments.blockComment
  ) {
    return undefined
  }
  return languageConfiguration.comments.blockComment
}

const RE_WHITESPACE_AT_START = /^\s+/

const getLineCommentEdit = (rowIndex, line, lineComment) => {
  const whitespaceMatch = line.match(RE_WHITESPACE_AT_START)
  const index = whitespaceMatch ? whitespaceMatch[0] : 0
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
  console.log('TOGGLE COMMENT')

  const lineComment = await getLineComment(editor)
  if (!lineComment) {
    return editor
  }
  // replaceSelections(editor, lineComment, 'editorToggleLineComment')
  const textDocument = editor
  const cursorRowIndex = editor.selections[0]
  const line = TextDocument.getLine(textDocument, cursorRowIndex)
  const documentEdits = [getLineCommentEdit(cursorRowIndex, line, lineComment)]
  // TODO cursor edits should be computed automatically from document edits
  // console.log({ documentEdits })
  // const cursorEdits = Editor.moveCursors(editor, (editor, cursor) => {
  // return cursor
  // })
  return Editor.scheduleDocumentAndCursorsSelections(editor, documentEdits)
}
