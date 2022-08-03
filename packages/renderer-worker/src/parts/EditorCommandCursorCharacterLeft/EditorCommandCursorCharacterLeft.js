import * as EditorCursorHorizontalLeft from '../EditorCommandCursorHorizontalLeft/EditorCommandCursorHorizontalLeft.js'
import * as EditorDelta from '../EditorCommandDelta/EditorCommandDelta.js'

export const editorCursorCharacterLeft = (editor) => {
  return EditorCursorHorizontalLeft.editorCursorHorizontalLeft(
    editor,
    EditorDelta.characterLeft
  )
}
