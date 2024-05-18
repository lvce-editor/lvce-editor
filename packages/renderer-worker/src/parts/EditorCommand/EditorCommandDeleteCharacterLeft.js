import * as EditorFunctionType from '../EditorFunctionType/EditorFunctionType.js'
import * as EditorWorker from '../EditorWorker/EditorWorker.js'
import * as RunEditorWidgetFunctions from './RunEditorWidgetFunctions.js'

export const deleteCharacterLeft = async (editor) => {
  const newEditor = await EditorWorker.invoke('Editor.deleteCharacterLeft', editor)
  return {
    newState: newEditor,
    commands: RunEditorWidgetFunctions.runEditorWidgetFunctions(newEditor, EditorFunctionType.HandleEditorDeleteLeft),
  }
}

export const deleteLeft = deleteCharacterLeft
