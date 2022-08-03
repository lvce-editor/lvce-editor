import * as EditorCursorHorizontalRight from '../EditorCommandCursorHorizontalRight/EditorCommandCursorHorizontalRight.js'
import * as EditorDelta from '../EditorCommandDelta/EditorCommandDelta.js'

export const editorCursorsCharacterRight = (editor) => {
  return EditorCursorHorizontalRight.editorCursorHorizontalRight(
    editor,
    EditorDelta.characterRight
  )
}
