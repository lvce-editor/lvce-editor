import * as Editor from '../Editor/Editor.js'
import * as ExtensionHostSelection from '../ExtensionHost/ExtensionHostSelection.js'

const getNewSelections = async (editor, selections) => {
  const rowIndex = selections[2]
  const columnIndex = selections[3]
  const newSelections = await ExtensionHostSelection.executeGrowSelection(editor, [rowIndex, columnIndex])
  if (newSelections.length === 0) {
    return selections
  }
  return new Uint32Array(newSelections)
}

export const selectionGrow = async (editor) => {
  const { selections } = editor
  const newSelections = await getNewSelections(editor, selections)
  return Editor.scheduleSelections(editor, newSelections)
}
