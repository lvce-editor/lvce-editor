import * as Editor from '../Editor/Editor.js'
import * as EditorGetPositionLeft from './EditorCommandGetPositionLeft.js'

const getNewSelection = (selection, lines, getDelta) => {
  if (selection.start !== selection.end) {
    return {
      start: selection.start,
      end: selection.start,
    }
  }
  const positionLeft = EditorGetPositionLeft.editorGetPositionLeft(
    selection.start,
    lines,
    getDelta
  )
  return {
    start: positionLeft,
    end: positionLeft,
  }
}

export const editorCursorHorizontalLeft = (editor, getDelta) => {
  const selectionEdits = []
  const lines = editor.lines
  for (const selection of editor.selections) {
    const newSelection = getNewSelection(selection, lines, getDelta)
    selectionEdits.push(newSelection)
  }
  return Editor.scheduleSelections(editor, selectionEdits)
}
