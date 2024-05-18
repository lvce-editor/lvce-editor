import * as EditorWorker from '../EditorWorker/EditorWorker.js'
import * as EditorFunctionType from '../EditorFunctionType/EditorFunctionType.js'
import * as RunEditorWidgetFunctions from './RunEditorWidgetFunctions.js'

export const deleteCharacterLeft = async (editor) => {
  // TODO new tokenizer api
  const { tokenizer, ...rest } = editor
  const { newState } = await EditorWorker.invoke('Editor.deleteCharacterLeft', rest)
  const newEditor = {
    ...newState,
    tokenizer,
  }
  return {
    newState: newEditor,
    commands: RunEditorWidgetFunctions.runEditorWidgetFunctions(newEditor, EditorFunctionType.HandleEditorDeleteLeft),
  }
}

export const deleteLeft = deleteCharacterLeft
