import * as EditorCursorHorizontalLeft from './EditorCommandCursorHorizontalLeft.js'
import * as EditorDelta from './EditorCommandDelta.js'

export const cursorCharacterLeft = (editor) => {
  return EditorCursorHorizontalLeft.editorCursorHorizontalLeft(
    editor,
    EditorDelta.characterLeft
  )
}
