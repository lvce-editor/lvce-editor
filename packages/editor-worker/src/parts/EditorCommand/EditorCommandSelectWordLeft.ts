import * as EditorSelectHorizontalLeft from './EditorCommandSelectHorizontalLeft.ts'
import * as EditorDelta from './EditorCommandDelta.ts'

// @ts-ignore
export const selectWordLeft = (editor) => {
  return EditorSelectHorizontalLeft.editorSelectHorizontalLeft(editor, EditorDelta.wordLeft)
}
