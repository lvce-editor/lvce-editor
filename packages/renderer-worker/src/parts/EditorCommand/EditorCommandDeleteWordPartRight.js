import * as EditorDeleteHorizontalRight from './EditorCommandDeleteHorizontalRight.js'
import * as EditorDelta from './EditorCommandDelta.js'

export const editorDeleteWordPartRight = (editor) => {
  EditorDeleteHorizontalRight.editorDeleteHorizontalRight(
    editor,
    EditorDelta.wordPartRight
  )
}
