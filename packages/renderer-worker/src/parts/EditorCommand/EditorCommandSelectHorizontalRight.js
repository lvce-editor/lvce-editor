import * as Editor from '../Editor/Editor.js'
import * as EditorGetPositionRight from './EditorCommandGetPositionRight.js'

const getNewSelection = (selection, lines, getDelta) => {
  const positionRight = EditorGetPositionRight.editorGetPositionRight(
    selection.end,
    lines,
    getDelta
  )
  return {
    start: selection.start,
    end: positionRight,
  }
}

export const editorSelectHorizontalRight = (editor, getDelta) => {
  const selectionEdits = []
  const lines = editor.lines
  for (const selection of editor.selections) {
    const newSelection = getNewSelection(selection, lines, getDelta)
    selectionEdits.push(newSelection)
  }
  return Editor.scheduleSelections(editor, selectionEdits)
}
