import * as EditorSelectHorizontalLeft from './EditorCommandSelectHorizontalLeft.ts'
import * as EditorDelta from './EditorCommandDelta.ts'

export const editorSelectAllLeft = (editor) => {
  EditorSelectHorizontalLeft.editorSelectHorizontalLeft(editor, EditorDelta.lineCharacterStart)
}
