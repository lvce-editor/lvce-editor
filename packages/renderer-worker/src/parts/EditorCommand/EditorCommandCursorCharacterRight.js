import * as EditorCursorHorizontalRight from './EditorCommandCursorHorizontalRight.js'
import * as EditorDelta from './EditorCommandDelta.js'
import * as EditorDeltaId from '../EditorDeltaId/EditorDeltaId.js'

export const cursorCharacterRight = (editor) => {
  return EditorCursorHorizontalRight.editorCursorHorizontalRight(editor, EditorDeltaId.CharacterRight)
}

export const cursorRight = cursorCharacterRight
