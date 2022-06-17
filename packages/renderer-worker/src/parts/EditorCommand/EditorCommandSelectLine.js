import * as Editor from '../Editor/Editor.js'
import * as TextDocument from '../TextDocument/TextDocument.js'

const getLineSelection = (line, rowIndex) => {
  const selection = {
    start: {
      rowIndex,
      columnIndex: 0,
    },
    end: {
      rowIndex,
      // TODO handle virtual space when columnIndex is greater than line length
      columnIndex: line.length,
    },
  }
  return selection
}

export const editorSelectLine = (editor) => {
  const rowIndex = editor.cursor.rowIndex
  const line = TextDocument.getLine(editor, rowIndex)
  const selection = getLineSelection(line, rowIndex)
  const selectionEdits = [selection]
  return Editor.scheduleSelections(editor, selectionEdits)
}
