import * as EditorDeltaId from '../EditorDeltaId/EditorDeltaId.js'
import * as EditorCursorHorizontalRight from './EditorCommandCursorHorizontalRight.js'

export const cursorWordRight = (editor) => {
  return EditorCursorHorizontalRight.editorCursorHorizontalRight(editor, EditorDeltaId.WordRight)
}
