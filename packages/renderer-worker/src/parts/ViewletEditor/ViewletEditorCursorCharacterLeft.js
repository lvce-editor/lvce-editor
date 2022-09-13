import * as EditorCursorHorizontalLeft from './ViewletEditorCursorHorizontalLeft.js'
import * as EditorDelta from './ViewletEditorDelta.js/index.js'

export const editorCursorCharacterLeft = (editor) => {
  return EditorCursorHorizontalLeft.editorCursorHorizontalLeft(
    editor,
    EditorDelta.characterLeft
  )
}
