import * as EditorDeleteHorizontalRight from './EditorCommandDeleteHorizontalRight.js'
import * as EditorDelta from './EditorCommandDelta.js'

export const editorDeleteWordRight = (editor) => {
  return EditorDeleteHorizontalRight.editorDeleteHorizontalRight(
    editor,
    EditorDelta.wordRight
  )
}
