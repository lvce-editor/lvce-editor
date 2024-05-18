import * as EditorCursorHorizontalLeft from './EditorCommandCursorHorizontalLeft.js'
import * as EditorDelta from './EditorCommandDelta.js'
import * as EditorDeltaId from '../EditorDeltaId/EditorDeltaId.js'

export const cursorCharacterLeft = (editor) => {
  return EditorCursorHorizontalLeft.editorCursorHorizontalLeft(editor, EditorDeltaId.CharacterLeft)
}

export const cursorLeft = cursorCharacterLeft
