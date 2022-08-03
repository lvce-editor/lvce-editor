import * as Editor from '../Editor/Editor.js'
import * as EditorGetPositionLeft from '../EditorCommandGetPositionLeft/EditorCommandGetPositionLeft.js'
import * as EditorSelection from '../EditorSelection/EditorSelection.js'
// TODO interleave cursors and selection
// then loop over selections
// apply edit
// if new range is empty -> add cursor
// else if new range is overlapping -> merge ranges
// else add cursor and selection

const getNewSelections = (selections, lines, getDelta) => {
  const newSelections = EditorSelection.clone(selections)
  for (let i = 0; i < selections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionStartColumn = selections[i + 1]
    const selectionEndRow = selections[i + 2]
    const selectionEndColumn = selections[i + 3]
    if (
      selectionStartRow === selectionEndRow &&
      selectionStartColumn === selectionEndColumn
    ) {
      EditorGetPositionLeft.moveToPositionLeft(
        newSelections,
        i,
        selectionStartRow,
        selectionStartColumn,
        lines,
        getDelta
      )
      EditorGetPositionLeft.moveToPositionEqual(
        newSelections,
        i + 2,
        selectionEndRow,
        selectionEndColumn
      )
    }
  }
  return newSelections
}

export const editorSelectHorizontalLeft = (editor, getDelta) => {
  const lines = editor.lines
  const selections = editor.selections
  const newSelections = getNewSelections(selections, lines, getDelta)
  return Editor.scheduleSelections(editor, newSelections)
}
