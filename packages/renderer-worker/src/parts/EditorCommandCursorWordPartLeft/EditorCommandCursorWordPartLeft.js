import * as EditorCursorHorizontalLeft from '../EditorCommandCursorHorizontalLeft/EditorCommandCursorHorizontalLeft.js'
import * as EditorDelta from '../EditorCommandDelta/EditorCommandDelta.js'

export const editorCursorWordPartLeft = (editor) => {
  return EditorCursorHorizontalLeft.editorCursorHorizontalLeft(
    editor,
    EditorDelta.wordPartLeft
  )
}
