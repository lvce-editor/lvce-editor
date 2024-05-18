import * as EditorDeltaId from '../EditorDeltaId/EditorDeltaId.js'
import * as EditorSelectHorizontalLeft from './EditorCommandSelectHorizontalLeft.js'

export const editorSelectAllLeft = (editor) => {
  EditorSelectHorizontalLeft.editorSelectHorizontalLeft(editor, EditorDeltaId.LineCharacterStart)
}
