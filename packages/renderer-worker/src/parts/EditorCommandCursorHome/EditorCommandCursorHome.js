import * as EditorCursorHorizontalLeft from '../EditorCommandCursorHorizontalLeft/EditorCommandCursorHorizontalLeft.js'
import * as EditorDelta from '../EditorCommandDelta/EditorCommandDelta.js'

export const editorCursorsHome = (editor) => {
  return EditorCursorHorizontalLeft.editorCursorHorizontalLeft(
    editor,
    EditorDelta.lineCharacterStart
  )
}
