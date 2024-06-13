import * as EditorSelectHorizontalLeft from './EditorCommandSelectHorizontalLeft.js'
import * as EditorDelta from './EditorCommandDelta.ts'

export const selectCharacterLeft = (editor) => {
  return EditorSelectHorizontalLeft.editorSelectHorizontalLeft(editor, EditorDelta.characterLeft)
}
