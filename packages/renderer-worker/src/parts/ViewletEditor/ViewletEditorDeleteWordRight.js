import * as EditorDeleteHorizontalRight from './ViewletEditorDeleteHorizontalRight.js/index.js.js'
import * as EditorDelta from './ViewletEditorDelta.js/index.js'

export const editorDeleteWordRight = (editor) => {
  return EditorDeleteHorizontalRight.editorDeleteHorizontalRight(
    editor,
    EditorDelta.wordRight
  )
}
