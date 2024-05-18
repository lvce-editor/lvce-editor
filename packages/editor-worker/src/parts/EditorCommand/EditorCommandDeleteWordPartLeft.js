import * as EditorDeleteHorizontalLeft from './EditorCommandDeleteHorizontalLeft.js'
import * as EditorDelta from './EditorCommandDelta.js'

export const deleteWordPartLeft = (editor) => {
  const newEditor = EditorDeleteHorizontalLeft.editorDeleteHorizontalLeft(editor, EditorDelta.wordPartLeft)
  return {
    newState: newEditor,
    commands: [],
  }
}
