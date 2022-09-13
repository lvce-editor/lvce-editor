import * as EditorSelectHorizontalLeft from './ViewletEditorSelectHorizontalLeft.js/index.js'
import * as EditorDelta from './ViewletEditorDelta.js/index.js'

export const editorSelectAllLeft = (editor) => {
  EditorSelectHorizontalLeft.editorSelectHorizontalLeft(
    editor,
    EditorDelta.lineCharacterStart
  )
}
