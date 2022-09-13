import * as EditorCursorHorizontalLeft from './ViewletEditorCursorHorizontalLeft.js'
import * as EditorDelta from './ViewletEditorDelta.js/index.js'

export const editorCursorsHome = (editor) => {
  return EditorCursorHorizontalLeft.editorCursorHorizontalLeft(
    editor,
    EditorDelta.lineCharacterStart
  )
}
