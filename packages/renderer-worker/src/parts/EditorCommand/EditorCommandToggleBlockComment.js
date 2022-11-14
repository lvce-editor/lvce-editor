import * as Languages from '../Languages/Languages.js'
import * as TextDocument from '../TextDocument/TextDocument.js'
import * as Editor from '../Editor/Editor.js'
import * as EditOrigin from '../EditOrigin/EditOrigin.js'

const RE_WHITESPACE_AT_START = /^\s+/
const RE_WHITESPACE_AT_END = /\s+$/

// const blockComment = ['<!--', '-->']

const getBlockComment = async (editor) => {
  const languageConfiguration = await Languages.getLanguageConfiguration(editor)
  if (
    !languageConfiguration ||
    !languageConfiguration.comments ||
    !languageConfiguration.comments.blockComment
  ) {
    return undefined
  }
  return languageConfiguration.comments.blockComment
}

export const toggleBlockComment = async (editor) => {
  const blockComment = await getBlockComment(editor)
  if (!blockComment) {
    return editor
  }
  const rowIndex = editor.selections[0]
  const columnIndex = editor.selections[1]
  const line = TextDocument.getLine(editor, rowIndex)
  const numberOfLines = editor.lines.length
  let endRowIndex = rowIndex
  let endColumnIndex = -1
  const blockCommentStart = blockComment[0]
  const blockCommentEnd = blockComment[1]
  while (endRowIndex < numberOfLines) {
    const line = TextDocument.getLine(editor, endRowIndex)
    endColumnIndex = line.indexOf(blockCommentEnd)
    if (endColumnIndex !== -1) {
      break
    }
    endRowIndex++
  }
  let startColumnIndex = -1
  let startRowIndex = rowIndex
  while (startRowIndex >= 0) {
    const line = TextDocument.getLine(editor, startRowIndex)
    startColumnIndex = line.indexOf(blockCommentStart)
    if (startColumnIndex !== -1) {
      break
    }
    startRowIndex--
  }
  const changes = []

  if (startColumnIndex !== -1 && endColumnIndex !== -1) {
    if (startRowIndex === endRowIndex) {
      const change1 = {
        start: {
          rowIndex,
          columnIndex: startColumnIndex,
        },
        end: {
          rowIndex,
          columnIndex: startColumnIndex + blockCommentStart.length,
        },
        inserted: [],
        deleted: [blockCommentStart],
        origin: EditOrigin.ToggleBlockComment,
      }
      const change2 = {
        start: {
          rowIndex,
          columnIndex: endColumnIndex - blockCommentStart.length,
        },
        end: {
          rowIndex,
          columnIndex:
            endColumnIndex - blockCommentStart.length + blockCommentEnd.length,
        },
        inserted: [],
        deleted: [blockCommentEnd],
        origin: EditOrigin.ToggleBlockComment,
      }
      changes.push(change1, change2)
      // Editor.moveCursors(editor, (editor, cursor) => {
      //   let newColumnIndex = cursor.columnIndex - blockComment[0].length
      //   if (cursor.columnIndex === endColumnIndex + blockComment[1].length) {
      //     newColumnIndex -= blockComment[1].length
      //   }
      //   return {
      //     rowIndex: cursor.rowIndex,
      //     columnIndex: newColumnIndex,
      //   }
      // })
    } else {
      const change1 = {
        start: {
          rowIndex: startRowIndex,
          columnIndex: startColumnIndex,
        },
        end: {
          rowIndex: startRowIndex,
          columnIndex: startColumnIndex + blockCommentStart.length,
        },
        inserted: [],
        deleted: [blockCommentStart],
        origin: EditOrigin.ToggleBlockComment,
      }
      const change2 = {
        start: {
          rowIndex: endRowIndex,
          columnIndex: endColumnIndex,
        },
        end: {
          rowIndex: endRowIndex,
          columnIndex: endColumnIndex + blockCommentEnd.length,
        },
        inserted: [],
        deleted: [blockCommentEnd],
        origin: EditOrigin.ToggleBlockComment,
      }
      changes.push(change1, change2)

      // const oldRow1 = TextDocument.getLine(editor, startRowIndex)
      // const newRow1 =
      //   oldRow1.slice(0, startColumnIndex) +
      //   oldRow1.slice(startColumnIndex + blockCommentStart.length)
      // const oldRow2 = TextDocument.getLine(editor, endRowIndex)
      // const newRow2 =
      //   oldRow2.slice(0, endColumnIndex) +
      //   oldRow2.slice(endColumnIndex + blockCommentEnd.length)
      // // TODO use applyEdit to have undo functionality
      // TextDocument.setLine(editor, startRowIndex, newRow1)
      // TextDocument.setLine(editor, endRowIndex, newRow2)
    }
    // TODO move cursors
  } else {
    const whitespaceAtStart = line.match(RE_WHITESPACE_AT_START)
    const whitespaceAtEnd = line.match(RE_WHITESPACE_AT_END)
    let startColumnIndex = 0
    let endColumnIndex = line.length
    if (whitespaceAtStart) {
      startColumnIndex += whitespaceAtStart[0].length
    }
    if (whitespaceAtEnd) {
      endColumnIndex -= whitespaceAtEnd[0].length
    }
    const change1 = {
      start: {
        rowIndex,
        columnIndex: startColumnIndex,
      },
      end: {
        rowIndex,
        columnIndex: startColumnIndex,
      },
      inserted: [blockCommentStart],
      deleted: [],
      origin: EditOrigin.ToggleBlockComment,
    }
    const change2 = {
      start: {
        rowIndex,
        columnIndex: endColumnIndex + blockCommentStart.length,
      },
      end: {
        rowIndex,
        columnIndex: endColumnIndex + blockCommentStart.length,
      },
      inserted: [blockCommentEnd],
      deleted: [],
      origin: EditOrigin.ToggleBlockComment,
    }
    changes.push(change1, change2)
    // TextDocument.setLine(
    //   editor,
    //   rowIndex,
    //   line.slice(0, startColumnIndex) +
    //     blockComment[0] +
    //     line.slice(startColumnIndex, endColumnIndex) +
    //     blockComment[1] +
    //     line.slice(endColumnIndex)
    // )
    // Editor.moveCursors(editor, (editor, cursor) => {
    //   let newColumnIndex = cursor.columnIndex + blockComment[0].length
    //   if (cursor.columnIndex === endColumnIndex) {
    //     newColumnIndex += blockComment[1].length
    //   }
    //   return {
    //     rowIndex: cursor.rowIndex,
    //     columnIndex: newColumnIndex,
    //   }
    // })
  }
  // if (line.startsWith(blockComment[0]) && line.endsWith(blockComment[1])) {
  //   lines[rowIndex] = line.slice(
  //     blockComment[0].length,
  //     line.length - blockComment[1].length
  //   )
  //   Editor.moveCursors((editor, cursor) => {
  //     return {
  //       rowIndex: cursor.rowIndex,
  //       columnIndex: cursor.columnIndex - blockComment[0].length,
  //     }
  //   })
  // } else {
  //   lines[rowIndex] = blockComment[0] + line + blockComment[1]
  //   Editor.moveCursors((editor, cursor) => {
  //     return {
  //       rowIndex: cursor.rowIndex,
  //       columnIndex: cursor.columnIndex + blockComment[0].length,
  //     }
  //   })
  // }
  // RendererProcess.invoke(/* setLines */ 2135, /* lines */ lines)

  return Editor.scheduleDocument(editor, changes)
}
