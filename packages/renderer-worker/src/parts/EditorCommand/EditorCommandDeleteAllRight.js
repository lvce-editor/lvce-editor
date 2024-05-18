import * as EditorDeltaId from '../EditorDeltaId/EditorDeltaId.js'
import * as EditorDeleteHorizontalRight from './EditorCommandDeleteHorizontalRight.js'

export const deleteAllRight = (editor) => {
  return EditorDeleteHorizontalRight.editorDeleteHorizontalRight(editor, EditorDeltaId.LineEnd)
}
