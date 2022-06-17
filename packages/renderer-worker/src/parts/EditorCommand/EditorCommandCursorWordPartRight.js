import * as EditorCursorHorizontalRight from './EditorCommandCursorHorizontalRight.js'
import * as EditorDelta from './EditorCommandDelta.js'

export const editorCursorWordPartRight = (editor) => {
  return EditorCursorHorizontalRight.editorCursorHorizontalRight(
    editor,
    EditorDelta.wordPartRight
  )
}
