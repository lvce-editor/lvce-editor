import * as EditorDeltaId from '../EditorDeltaId/EditorDeltaId.js'
import * as EditorSelectHorizontalRight from './EditorCommandSelectHorizontalRight.js'

export const selectWordRight = (editor) => {
  return EditorSelectHorizontalRight.editorSelectHorizontalRight(editor, EditorDeltaId.WordRight)
}
