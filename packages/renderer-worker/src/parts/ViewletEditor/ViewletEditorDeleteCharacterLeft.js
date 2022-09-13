import * as EditorDeleteHorizontalLeft from './ViewletEditorDeleteHorizontalLeft.js/index.js.js'
import * as EditorDelta from './ViewletEditorDelta.js/index.js'

export const editorDeleteCharacterLeft = (editor) => {
  return EditorDeleteHorizontalLeft.editorDeleteHorizontalLeft(
    editor,
    EditorDelta.characterLeft
  )
}
