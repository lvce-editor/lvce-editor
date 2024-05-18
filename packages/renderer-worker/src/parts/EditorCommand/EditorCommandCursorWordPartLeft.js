import * as EditorDeltaId from '../EditorDeltaId/EditorDeltaId.js'
import * as EditorCursorHorizontalLeft from './EditorCommandCursorHorizontalLeft.js'

export const cursorWordPartLeft = (editor) => {
  return EditorCursorHorizontalLeft.editorCursorHorizontalLeft(editor, EditorDeltaId.WordPartLeft)
}
