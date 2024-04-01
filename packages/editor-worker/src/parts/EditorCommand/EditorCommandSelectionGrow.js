// @ts-ignore
import * as Editor from '../Editor/Editor.js'
// @ts-ignore
import * as ExtensionHostSelection from '../ExtensionHost/ExtensionHostSelection.js'

const getNewSelections = async (editor, selections) => {
  const newSelections = await ExtensionHostSelection.executeGrowSelection(editor, selections)
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
