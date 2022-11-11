import * as Editor from '../Editor/Editor.js'
import * as TextDocument from '../TextDocument/TextDocument.js'

const getNewSelections = (line, rowIndex) => {
  // TODO handle virtual space when columnIndex is greater than line length
  return new Uint32Array([rowIndex, 0, rowIndex, line.length])
}

export const selectLine = (editor) => {
  const selections = editor.selections
  const rowIndex = selections[editor.primarySelectionIndex]
  const line = TextDocument.getLine(editor, rowIndex)
  const newSelections = getNewSelections(line, rowIndex)
  return Editor.scheduleSelections(editor, newSelections)
}
