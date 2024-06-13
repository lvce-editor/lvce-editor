import * as EditorSelectHorizontalLeft from './EditorCommandSelectHorizontalLeft.js'
import * as EditorDelta from './EditorCommandDelta.ts'

export const editorSelectAllLeft = (editor) => {
  EditorSelectHorizontalLeft.editorSelectHorizontalLeft(editor, EditorDelta.lineCharacterStart)
}
