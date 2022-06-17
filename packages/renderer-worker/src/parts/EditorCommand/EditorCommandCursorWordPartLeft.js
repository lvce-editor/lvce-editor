import * as EditorCursorHorizontalLeft from './EditorCommandCursorHorizontalLeft.js'
import * as EditorDelta from './EditorCommandDelta.js'

export const editorCursorWordPartLeft = (editor) => {
  return EditorCursorHorizontalLeft.editorCursorHorizontalLeft(
    editor,
    EditorDelta.wordPartLeft
  )
}
