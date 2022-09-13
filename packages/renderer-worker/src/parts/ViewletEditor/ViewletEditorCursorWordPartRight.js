import * as EditorCursorHorizontalRight from './ViewletEditorCursorHorizontalRight.js'
import * as EditorDelta from './ViewletEditorDelta.js/index.js'

export const editorCursorWordPartRight = (editor) => {
  return EditorCursorHorizontalRight.editorCursorHorizontalRight(
    editor,
    EditorDelta.wordPartRight
  )
}
