import * as EditorDeleteHorizontalLeft from '../EditorCommandDeleteHorizontalLeft/EditorCommandDeleteHorizontalLeft.js'
import * as EditorDelta from '../EditorCommandDelta/EditorCommandDelta.js'

export const editorDeleteWordPartLeft = (editor) => {
  EditorDeleteHorizontalLeft.editorDeleteHorizontalLeft(
    editor,
    EditorDelta.wordPartLeft
  )
}
