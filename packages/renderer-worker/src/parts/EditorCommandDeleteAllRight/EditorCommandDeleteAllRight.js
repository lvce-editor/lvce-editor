import * as EditorDeleteHorizontalRight from '../EditorCommandDeleteHorizontalRight/EditorCommandDeleteHorizontalRight.js'
import * as EditorDelta from '../EditorCommandDelta/EditorCommandDelta.js'

export const editorDeleteAllRight = (editor) => {
  return EditorDeleteHorizontalRight.editorDeleteHorizontalRight(
    editor,
    EditorDelta.lineEnd
  )
}
