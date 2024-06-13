import * as EditorSelectHorizontalRight from './EditorCommandSelectHorizontalRight.ts'
import * as EditorDelta from './EditorCommandDelta.ts'

// @ts-ignore
export const selectCharacterRight = (editor) => {
  return EditorSelectHorizontalRight.editorSelectHorizontalRight(editor, EditorDelta.characterRight)
}
