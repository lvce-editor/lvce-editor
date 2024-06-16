import * as Editor from '../Editor/Editor.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
// import * as ExtensionHostSelection from '../ExtensionHost/ExtensionHostSelection.ts'

const getNewSelections = async (editor: any, selections: any) => {
  const newSelections = await RendererWorker.invoke('ExtensionHostSelection.executeGrowSelection', editor, selections)
  if (newSelections.length === 0) {
    return selections
  }
  return new Uint32Array(newSelections)
}

export const selectionGrow = async (editor: any) => {
  const { selections } = editor
  const newSelections = await getNewSelections(editor, selections)
  return Editor.scheduleSelections(editor, newSelections)
}
