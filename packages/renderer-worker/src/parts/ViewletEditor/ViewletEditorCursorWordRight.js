import * as EditorCursorHorizontalRight from './ViewletEditorCursorHorizontalRight.js'
import * as EditorDelta from './ViewletEditorDelta.js/index.js'

export const editorCursorWordRight = (editor) => {
  return EditorCursorHorizontalRight.editorCursorHorizontalRight(
    editor,
    EditorDelta.wordRight
  )
}
