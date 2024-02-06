import * as Editor from '../Editor/Editor.js'

const getNewSelections = (lines, selections) => {
  // TODO query selections from extension host
  return selections
}

export const selectionGrow = (editor) => {
  const { selections } = editor
  const { lines } = editor
  const newSelections = getNewSelections(lines, selections)
  return Editor.scheduleSelections(editor, newSelections)
}
