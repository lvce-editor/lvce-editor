import * as EditorSelectHorizontalRight from './ViewletEditorSelectHorizontalRight.js/index.js'
import * as EditorDelta from './ViewletEditorDelta.js/index.js'

export const editorSelectAllRight = (editor) => {
  return EditorSelectHorizontalRight.editorSelectHorizontalRight(
    editor,
    EditorDelta.lineEnd
  )
}
