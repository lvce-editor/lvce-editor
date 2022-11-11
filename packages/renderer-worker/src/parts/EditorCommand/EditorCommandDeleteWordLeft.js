import * as EditorDeleteHorizontalLeft from './EditorCommandDeleteHorizontalLeft.js'
import * as EditorDelta from './EditorCommandDelta.js'

export const deleteWordLeft = (editor) => {
  return EditorDeleteHorizontalLeft.editorDeleteHorizontalLeft(
    editor,
    EditorDelta.wordLeft
  )
}
