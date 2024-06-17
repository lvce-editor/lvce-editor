import * as EditorSelectHorizontalRight from './EditorCommandSelectHorizontalRight.ts'
import * as EditorDelta from './EditorCommandDelta.ts'

export const selectCharacterRight = (editor: any) => {
  return EditorSelectHorizontalRight.editorSelectHorizontalRight(editor, EditorDelta.characterRight)
}
