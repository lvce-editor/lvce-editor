// @ts-ignore
import * as Editor from '../Editor/Editor.ts'
// @ts-ignore
import * as ExtensionHostSelection from '../ExtensionHost/ExtensionHostSelection.ts'
// import * as ExtensionHostSelection from '../ExtensionHost/ExtensionHostSelection.ts'

// @ts-ignore
const getNewSelections = async (editor, selections) => {
  // TODO
  // const newSelections = await ExtensionHostSelection.executeGrowSelection(editor, selections)
  // if (newSelections.length === 0) {
  //   return selections
  // }
  // return new Uint32Array(newSelections)
  return selections
}

// @ts-ignore
export const selectionGrow = async (editor) => {
  const { selections } = editor
  const newSelections = await getNewSelections(editor, selections)
  return Editor.scheduleSelections(editor, newSelections)
}
