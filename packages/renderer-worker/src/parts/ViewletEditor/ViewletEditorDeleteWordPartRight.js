import * as EditorDeleteHorizontalRight from './ViewletEditorDeleteHorizontalRight.js/index.js.js'
import * as EditorDelta from './ViewletEditorDelta.js/index.js'

export const editorDeleteWordPartRight = (editor) => {
  EditorDeleteHorizontalRight.editorDeleteHorizontalRight(
    editor,
    EditorDelta.wordPartRight
  )
}
