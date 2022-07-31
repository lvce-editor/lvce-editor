import * as Editor from '../Editor/Editor.js'

const getNewSelections = (selections, lines, getDelta) => {
  const newSelections = new Uint32Array(selections.length)
  for (let i = 0; i < selections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionStartColumn = selections[i + 1]
    const selectionEndRow = selections[i + 2]
    const selectionEndColumn = selections[i + 3]
    const line = lines[selectionEndRow]
    newSelections[i] = selectionStartRow
    newSelections[i + 1] = selectionStartColumn
    if (selectionEndColumn >= line.length) {
      newSelections[i + 2] = selectionEndRow + 1
      newSelections[i + 3] = 0
    } else {
      const delta = getDelta(line, selectionEndColumn)
      newSelections[i + 2] = selectionEndRow
      newSelections[i + 3] = selectionEndColumn + delta
    }
  }
  return newSelections
}

export const editorSelectHorizontalRight = (editor, getDelta) => {
  const lines = editor.lines
  const selections = editor.selections
  const newSelections = getNewSelections(selections, lines, getDelta)
  return Editor.scheduleSelections(editor, newSelections)
}
