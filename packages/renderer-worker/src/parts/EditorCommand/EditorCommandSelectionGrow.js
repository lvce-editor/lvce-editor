import * as Editor from '../Editor/Editor.js'
import * as ExtensionHostSelection from '../ExtensionHost/ExtensionHostSelection.js'

const getNewSelections = async (editor, selections) => {
  const rowIndex = selections[0]
  const columnIndex = selections[1]
  const newSelections = await ExtensionHostSelection.executeSelectionProvider(editor, [rowIndex, columnIndex])
  return newSelections
}

export const selectionGrow = async (editor) => {
  const { selections } = editor
  const newSelections = await getNewSelections(editor, selections)
  return Editor.scheduleSelections(editor, newSelections)
}
