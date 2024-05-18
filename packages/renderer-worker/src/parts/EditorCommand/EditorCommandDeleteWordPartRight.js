import * as EditorDeltaId from '../EditorDeltaId/EditorDeltaId.js'
import * as EditorDeleteHorizontalRight from './EditorCommandDeleteHorizontalRight.js'

export const deleteWordPartRight = (editor) => {
  EditorDeleteHorizontalRight.editorDeleteHorizontalRight(editor, EditorDeltaId.WordPartRight)
}
