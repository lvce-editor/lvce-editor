import * as EditorDeltaId from '../EditorDeltaId/EditorDeltaId.js'
import * as EditorDeleteHorizontalRight from './EditorCommandDeleteHorizontalRight.js'

export const deleteWordRight = (editor) => {
  return EditorDeleteHorizontalRight.editorDeleteHorizontalRight(editor, EditorDeltaId.WordRight)
}
