import * as Editor from '../Editor/Editor.js'
import * as EditorGetPositionLeft from './EditorCommandGetPositionLeft.js'

// TODO interleave cursors and selection
// then loop over selections
// apply edit
// if new range is empty -> add cursor
// else if new range is overlapping -> merge ranges
// else add cursor and selection

const getNewSelection = (selection, lines, getDelta) => {
  const positionLeft = EditorGetPositionLeft.editorGetPositionLeft(
    selection.start,
    lines,
    getDelta
  )
  return {
    start: positionLeft,
    end: selection.end,
  }
}

export const editorSelectHorizontalLeft = (editor, getDelta) => {
  const selectionEdits = []
  const lines = editor.lines
  for (const selection of editor.selections) {
    const newSelection = getNewSelection(selection, lines, getDelta)
    selectionEdits.push(newSelection)
  }
  return Editor.scheduleSelections(editor, selectionEdits)
}
