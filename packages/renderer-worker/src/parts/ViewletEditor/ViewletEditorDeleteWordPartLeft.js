import * as EditorDeleteHorizontalLeft from './ViewletEditorDeleteHorizontalLeft.js/index.js.js'
import * as EditorDelta from './ViewletEditorDelta.js/index.js'

export const editorDeleteWordPartLeft = (editor) => {
  EditorDeleteHorizontalLeft.editorDeleteHorizontalLeft(
    editor,
    EditorDelta.wordPartLeft
  )
}
