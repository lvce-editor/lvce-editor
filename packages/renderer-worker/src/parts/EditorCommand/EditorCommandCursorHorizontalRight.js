import * as Editor from '../Editor/Editor.js'
import * as EditorGetPositionRight from './EditorCommandGetPositionRight.js'

const getNewSelection = (selection, lines, getDelta) => {
  if (selection.start !== selection.end) {
    return {
      start: selection.end,
      end: selection.end,
    }
  }
  const positionRight = EditorGetPositionRight.editorGetPositionRight(
    selection.end,
    lines,
    getDelta
  )
  return {
    start: positionRight,
    end: positionRight,
  }
}

export const editorCursorHorizontalRight = (editor, getDelta) => {
  const selectionEdits = []
  const lines = editor.lines
  for (const selection of editor.selections) {
    const newSelection = getNewSelection(selection, lines, getDelta)
    selectionEdits.push(newSelection)
  }
  return Editor.scheduleSelections(editor, selectionEdits)
}
