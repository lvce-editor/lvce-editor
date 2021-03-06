import * as EditorCursorHorizontalRight from './EditorCommandCursorHorizontalRight.js'
import * as EditorDelta from './EditorCommandDelta.js'

export const editorCursorWordRight = (editor) => {
  return EditorCursorHorizontalRight.editorCursorHorizontalRight(
    editor,
    EditorDelta.wordRight
  )
}
