import * as EditorDeltaId from '../EditorDeltaId/EditorDeltaId.js'
import * as EditorFunctionType from '../EditorFunctionType/EditorFunctionType.js'
import * as EditorDeleteHorizontalLeft from './EditorCommandDeleteHorizontalLeft.js'
import * as RunEditorWidgetFunctions from './RunEditorWidgetFunctions.js'

export const deleteWordLeft = (editor) => {
  const newEditor = EditorDeleteHorizontalLeft.editorDeleteHorizontalLeft(editor, EditorDeltaId.WordLeft)
  return {
    newState: newEditor,
    commands: RunEditorWidgetFunctions.runEditorWidgetFunctions(newEditor, EditorFunctionType.HandleEditorDeleteLeft),
  }
}
