import * as EditorDeltaId from '../EditorDeltaId/EditorDeltaId.js'
import * as EditorDeleteHorizontalRight from './EditorCommandDeleteHorizontalRight.js'

export const deleteCharacterRight = (editor) => {
  return EditorDeleteHorizontalRight.editorDeleteHorizontalRight(editor, EditorDeltaId.CharacterRight)
}

export const deleteRight = deleteCharacterRight
