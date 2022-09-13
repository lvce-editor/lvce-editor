import * as EditorCursorHorizontalLeft from './ViewletEditorCursorHorizontalLeft.js'
import * as EditorDelta from './ViewletEditorDelta.js/index.js'

export const editorCursorWordPartLeft = (editor) => {
  return EditorCursorHorizontalLeft.editorCursorHorizontalLeft(
    editor,
    EditorDelta.wordPartLeft
  )
}
