import * as EditorFunctionType from '../EditorFunctionType/EditorFunctionType.js'
import * as EditorWorker from '../EditorWorker/EditorWorker.js'
import * as RunEditorWidgetFunctions from './RunEditorWidgetFunctions.js'

export const deleteWordLeft = async (editor) => {
  const { newState } = await EditorWorker.invoke('Editor.deleteWordLeft', editor)
  return {
    newState,
    commands: RunEditorWidgetFunctions.runEditorWidgetFunctions(newState, EditorFunctionType.HandleEditorDeleteLeft),
  }
}
