import * as EditorDeleteHorizontalRight from '../EditorCommandDeleteHorizontalRight/EditorCommandDeleteHorizontalRight.js'
import * as EditorDelta from '../EditorCommandDelta/EditorCommandDelta.js'

export const editorDeleteWordPartRight = (editor) => {
  EditorDeleteHorizontalRight.editorDeleteHorizontalRight(
    editor,
    EditorDelta.wordPartRight
  )
}
