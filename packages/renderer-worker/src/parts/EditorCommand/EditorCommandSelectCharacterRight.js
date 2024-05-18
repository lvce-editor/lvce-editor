import * as EditorDeltaId from '../EditorDeltaId/EditorDeltaId.js'
import * as EditorSelectHorizontalRight from './EditorCommandSelectHorizontalRight.js'

export const selectCharacterRight = (editor) => {
  return EditorSelectHorizontalRight.editorSelectHorizontalRight(editor, EditorDeltaId.CharacterRight)
}
