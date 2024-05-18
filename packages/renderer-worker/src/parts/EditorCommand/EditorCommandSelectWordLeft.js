import * as EditorDeltaId from '../EditorDeltaId/EditorDeltaId.js'
import * as EditorSelectHorizontalLeft from './EditorCommandSelectHorizontalLeft.js'

export const selectWordLeft = (editor) => {
  return EditorSelectHorizontalLeft.editorSelectHorizontalLeft(editor, EditorDeltaId.WordLeft)
}
