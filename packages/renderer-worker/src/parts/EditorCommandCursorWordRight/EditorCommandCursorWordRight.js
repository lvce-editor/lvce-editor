import * as EditorCursorHorizontalRight from '../EditorCommandCursorHorizontalRight/EditorCommandCursorHorizontalRight.js'
import * as EditorDelta from '../EditorCommandDelta/EditorCommandDelta.js'

export const editorCursorWordRight = (editor) => {
  return EditorCursorHorizontalRight.editorCursorHorizontalRight(
    editor,
    EditorDelta.wordRight
  )
}
