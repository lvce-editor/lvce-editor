import * as EditorDeleteHorizontalRight from './EditorCommandDeleteHorizontalRight.js'
import * as EditorDelta from './EditorCommandDelta.js'

export const deleteAllRight = (editor) => {
  return EditorDeleteHorizontalRight.editorDeleteHorizontalRight(
    editor,
    EditorDelta.lineEnd
  )
}
