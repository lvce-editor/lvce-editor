import * as EditorSelectHorizontalRight from './ViewletEditorSelectHorizontalRight.js/index.js'
import * as EditorDelta from './ViewletEditorDelta.js/index.js'

export const editorSelectWordRight = (editor) => {
  return EditorSelectHorizontalRight.editorSelectHorizontalRight(
    editor,
    EditorDelta.wordRight
  )
}
