import * as EditorDeleteHorizontalLeft from '../EditorCommandDeleteHorizontalLeft/EditorCommandDeleteHorizontalLeft.js'
import * as EditorDelta from '../EditorCommandDelta/EditorCommandDelta.js'

export const editorDeleteWordLeft = (editor) => {
  return EditorDeleteHorizontalLeft.editorDeleteHorizontalLeft(
    editor,
    EditorDelta.wordLeft
  )
}
