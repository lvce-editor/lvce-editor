import * as EditorCursorHorizontalRight from './EditorCommandCursorHorizontalRight.js'
import * as EditorDelta from './EditorCommandDelta.js'

export const cursorEnd = (editor) => {
  return EditorCursorHorizontalRight.editorCursorHorizontalRight(
    editor,
    EditorDelta.lineEnd
  )
}
