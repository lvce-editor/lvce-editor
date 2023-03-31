import * as EditorFunctionType from '../EditorFunctionType/EditorFunctionType.js'
import * as EditorDeleteHorizontalLeft from './EditorCommandDeleteHorizontalLeft.js'
import * as EditorDelta from './EditorCommandDelta.js'
import * as RunEditorWidgetFunctions from './RunEditorWidgetFunctions.js'

export const deleteWordPartLeft = (editor) => {
  const newEditor = EditorDeleteHorizontalLeft.editorDeleteHorizontalLeft(editor, EditorDelta.wordPartLeft)
  return {
    newState: newEditor,
    commands: RunEditorWidgetFunctions.runEditorWidgetFunctions(newEditor, EditorFunctionType.HandleEditorDeleteLeft),
  }
}
