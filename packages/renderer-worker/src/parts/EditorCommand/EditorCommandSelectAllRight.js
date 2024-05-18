import * as EditorDeltaId from '../EditorDeltaId/EditorDeltaId.js'
import * as EditorSelectHorizontalRight from './EditorCommandSelectHorizontalRight.js'

export const editorSelectAllRight = (editor) => {
  return EditorSelectHorizontalRight.editorSelectHorizontalRight(editor, EditorDeltaId.LineEnd)
}
