import * as EditorCursorHorizontalRight from '../EditorCommandCursorHorizontalRight/EditorCommandCursorHorizontalRight.js'
import * as EditorDelta from '../EditorCommandDelta/EditorCommandDelta.js'

export const editorCursorEnd = (editor) => {
  return EditorCursorHorizontalRight.editorCursorHorizontalRight(
    editor,
    EditorDelta.lineEnd
  )
}
