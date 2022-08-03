import * as EditorCursorHorizontalRight from '../EditorCommand/EditorCommandCursorHorizontalRight.js'
import * as EditorDelta from '../EditorCommandDelta/EditorCommandDelta.js'

export const editorCursorWordPartRight = (editor) => {
  return EditorCursorHorizontalRight.editorCursorHorizontalRight(
    editor,
    EditorDelta.wordPartRight
  )
}
