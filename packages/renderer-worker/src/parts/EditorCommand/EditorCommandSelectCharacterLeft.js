import * as EditorDeltaId from '../EditorDeltaId/EditorDeltaId.js'
import * as EditorSelectHorizontalLeft from './EditorCommandSelectHorizontalLeft.js'

export const selectCharacterLeft = (editor) => {
  return EditorSelectHorizontalLeft.editorSelectHorizontalLeft(editor, EditorDeltaId.CharacterLeft)
}
