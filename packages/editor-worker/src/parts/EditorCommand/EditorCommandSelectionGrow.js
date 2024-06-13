import * as Editor from '../Editor/Editor.js'
// import * as ExtensionHostSelection from '../ExtensionHost/ExtensionHostSelection.js'

const getNewSelections = async (editor, selections) => {
  // TODO
  // const newSelections = await ExtensionHostSelection.executeGrowSelection(editor, selections)
  // if (newSelections.length === 0) {
  //   return selections
  // }
  // return new Uint32Array(newSelections)
  return selections
}

export const selectionGrow = async (editor) => {
  const { selections } = editor
  const newSelections = await getNewSelections(editor, selections)
  return Editor.scheduleSelections(editor, newSelections)
}
