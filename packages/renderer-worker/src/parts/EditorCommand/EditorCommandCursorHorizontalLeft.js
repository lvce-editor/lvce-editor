import * as Editor from '../Editor/Editor.js'
import * as EditorGetPositionLeft from './EditorCommandGetPositionLeft.js'
import * as RunEditorWidgetFunctions from './RunEditorWidgetFunctions.js'
import * as EditorFunctionType from '../EditorFunctionType/EditorFunctionType.js'

const getNewSelections = (selections, lines, getDelta) => {
  const newSelections = new Uint32Array(selections.length)
  for (let i = 0; i < selections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionStartColumn = selections[i + 1]
    const selectionEndRow = selections[i + 2]
    const selectionEndColumn = selections[i + 3]
    if (selectionStartRow === selectionEndRow && selectionStartColumn === selectionEndColumn) {
      if (selectionStartRow === 0 && selectionStartColumn === 0) {
        newSelections[i] = 0
        newSelections[i + 1] = 0
        newSelections[i + 2] = 0
        newSelections[i + 3] = 0
      } else {
        EditorGetPositionLeft.moveToPositionLeft(newSelections, i, selectionStartRow, selectionStartColumn, lines, getDelta)
        EditorGetPositionLeft.moveToPositionLeft(newSelections, i + 2, selectionStartRow, selectionStartColumn, lines, getDelta)
      }
    } else {
      EditorGetPositionLeft.moveRangeToPosition(newSelections, i, selections[i], selections[i + 1])
    }
  }
  return newSelections
}

export const editorCursorHorizontalLeft = (editor, getDelta) => {
  const lines = editor.lines
  const selections = editor.selections
  const newSelections = getNewSelections(selections, lines, getDelta)
  const newEditor = Editor.scheduleSelections(editor, newSelections)
  return {
    newState: newEditor,
    commands: RunEditorWidgetFunctions.runEditorWidgetFunctions(newEditor, EditorFunctionType.HandleCursorMove),
  }
}
