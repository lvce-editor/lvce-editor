import * as EditorSelectHorizontalRight from './EditorCommandSelectHorizontalRight.js'
import * as EditorDelta from './EditorCommandDelta.ts'

export const editorSelectAllRight = (editor) => {
  return EditorSelectHorizontalRight.editorSelectHorizontalRight(editor, EditorDelta.lineEnd)
}
