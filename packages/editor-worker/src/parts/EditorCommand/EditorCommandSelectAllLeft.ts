import * as EditorSelectHorizontalLeft from './EditorCommandSelectHorizontalLeft.ts'
import * as EditorDelta from './EditorCommandDelta.ts'

// @ts-ignore
export const editorSelectAllLeft = (editor) => {
  EditorSelectHorizontalLeft.editorSelectHorizontalLeft(editor, EditorDelta.lineCharacterStart)
}
