import * as EditorDeltaId from '../EditorDeltaId/EditorDeltaId.js'
import * as EditorDeleteHorizontalLeft from './EditorCommandDeleteHorizontalLeft.js'

export const deleteAllLeft = (editor) => {
  return EditorDeleteHorizontalLeft.editorDeleteHorizontalLeft(editor, EditorDeltaId.LineCharacterStart)
}
