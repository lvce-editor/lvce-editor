import * as EditorDeleteHorizontalLeft from './EditorCommandDeleteHorizontalLeft.js'
import * as EditorDelta from './EditorCommandDelta.js'
import * as RunEditorWidgetFunctions from './RunEditorWidgetFunctions.js'

export const deleteCharacterLeft = (editor) => {
  const newEditor = EditorDeleteHorizontalLeft.editorDeleteHorizontalLeft(editor, EditorDelta.characterLeft)
  RunEditorWidgetFunctions.runEditorWidgetFunctions(newEditor, 'deleteCharacterLeft')
  return newEditor
}

export const deleteLeft = deleteCharacterLeft
