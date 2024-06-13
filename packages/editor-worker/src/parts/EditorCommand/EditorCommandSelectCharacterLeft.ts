import * as EditorSelectHorizontalLeft from './EditorCommandSelectHorizontalLeft.ts'
import * as EditorDelta from './EditorCommandDelta.ts'

export const selectCharacterLeft = (editor) => {
  return EditorSelectHorizontalLeft.editorSelectHorizontalLeft(editor, EditorDelta.characterLeft)
}
