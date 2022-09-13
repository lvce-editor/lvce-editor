import * as EditorCursorHorizontalRight from './ViewletEditorCursorHorizontalRight.js'
import * as EditorDelta from './ViewletEditorDelta.js/index.js'

export const editorCursorEnd = (editor) => {
  return EditorCursorHorizontalRight.editorCursorHorizontalRight(
    editor,
    EditorDelta.lineEnd
  )
}
