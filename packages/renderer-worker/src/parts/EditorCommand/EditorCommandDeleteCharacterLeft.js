import * as EditorFunctionType from '../EditorFunctionType/EditorFunctionType.js'
import * as EditorWorker from '../EditorWorker/EditorWorker.js'
import * as RunEditorWidgetFunctions from './RunEditorWidgetFunctions.js'

export const deleteCharacterLeft = async (editor) => {
  const { newState } = await EditorWorker.invoke('Editor.deleteCharacterLeft', editor)
  return {
    newState,
    commands: RunEditorWidgetFunctions.runEditorWidgetFunctions(newState, EditorFunctionType.HandleEditorDeleteLeft),
  }
}

export const deleteLeft = deleteCharacterLeft
