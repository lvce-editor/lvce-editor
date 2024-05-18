import * as EditorDeltaId from '../EditorDeltaId/EditorDeltaId.js'
import * as EditorCursorHorizontalRight from './EditorCommandCursorHorizontalRight.js'

export const cursorWordPartRight = (editor) => {
  return EditorCursorHorizontalRight.editorCursorHorizontalRight(editor, EditorDeltaId.WordPartRight)
}
