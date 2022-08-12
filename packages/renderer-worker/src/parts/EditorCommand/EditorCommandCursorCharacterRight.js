import * as EditorCursorHorizontalRight from './EditorCommandCursorHorizontalRight.js'
import * as EditorDelta from './EditorCommandDelta.js'

export const editorCursorCharacterRight = (editor) => {
  return EditorCursorHorizontalRight.editorCursorHorizontalRight(
    editor,
    EditorDelta.characterRight
  )
}
