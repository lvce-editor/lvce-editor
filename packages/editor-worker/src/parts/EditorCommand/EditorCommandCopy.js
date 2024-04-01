import * as Command from '../Command/Command.js'
// @ts-ignore
import * as Editor from '../Editor/Editor.js'
import * as JoinLines from '../JoinLines/JoinLines.js'
// @ts-ignore
import * as RendererWorkerCommandType from '../RendererWorkerCommandType/RendererWorkerCommandType.js'
// @ts-ignore
import * as TextDocument from '../TextDocument/TextDocument.js'

const getSelectionRange = (lines, copyFullLine, startRowIndex, startColumnIndex, endRowIndex, endColumnIndex) => {
  if (copyFullLine) {
    const lineLength = lines[endRowIndex].length
    return {
      start: {
        rowIndex: startRowIndex,
        columnIndex: 0,
      },
      end: {
        rowIndex: startRowIndex,
        columnIndex: lineLength,
      },
    }
  }
  return {
    start: {
      rowIndex: startRowIndex,
      columnIndex: startColumnIndex,
    },
    end: {
      rowIndex: endRowIndex,
      columnIndex: endColumnIndex,
    },
  }
}

const shouldCopyFullLine = (startRowIndex, startColumnIndex, endRowIndex, endColumnIndex) => {
  return startRowIndex === endRowIndex && startColumnIndex === endColumnIndex
}

export const copy = async (editor) => {
  if (!Editor.hasSelection(editor)) {
    // TODO copy line where cursor is
    return editor
  }
  const { lines, selections } = editor
  const selectionStartRowIndex = selections[0]
  const selectionStartColumnIndex = selections[1]
  const selectionEndRowIndex = selections[2]
  const selectionEndColumnIndex = selections[3]
  const copyFullLine = shouldCopyFullLine(selectionStartRowIndex, selectionStartColumnIndex, selectionEndRowIndex, selectionEndColumnIndex)
  const range = getSelectionRange(
    lines,
    copyFullLine,
    selectionStartRowIndex,
    selectionStartColumnIndex,
    selectionEndRowIndex,
    selectionEndColumnIndex,
  )
  const selectedLines = TextDocument.getSelectionText(editor, range)
  const text = JoinLines.joinLines(selectedLines)
  const fullText = copyFullLine ? '\n' + text : text
  await Command.execute(RendererWorkerCommandType.ClipBoardWriteText, fullText)
  return editor
}
