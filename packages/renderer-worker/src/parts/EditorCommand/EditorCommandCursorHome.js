import * as EditorDeltaId from '../EditorDeltaId/EditorDeltaId.js'
import * as EditorCursorHorizontalLeft from './EditorCommandCursorHorizontalLeft.js'

export const cursorHome = (editor) => {
  return EditorCursorHorizontalLeft.editorCursorHorizontalLeft(editor, EditorDeltaId.LineCharacterStart)
}
