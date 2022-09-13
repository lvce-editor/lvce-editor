import * as EditorSelectHorizontalLeft from './ViewletEditorSelectHorizontalLeft.js/index.js'
import * as EditorDelta from './ViewletEditorDelta.js/index.js'

export const editorSelectWordLeft = (editor) => {
  return EditorSelectHorizontalLeft.editorSelectHorizontalLeft(
    editor,
    EditorDelta.wordLeft
  )
}
