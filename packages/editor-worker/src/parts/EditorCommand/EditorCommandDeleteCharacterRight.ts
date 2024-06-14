import * as EditorDeleteHorizontalRight from './EditorCommandDeleteHorizontalRight.ts'
import * as EditorDelta from './EditorCommandDelta.ts'

export const deleteCharacterRight = (editor: any) => {
  return EditorDeleteHorizontalRight.editorDeleteHorizontalRight(editor, EditorDelta.characterRight)
}

export const deleteRight = deleteCharacterRight
