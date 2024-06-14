import * as EditorDeleteHorizontalLeft from './EditorCommandDeleteHorizontalLeft.ts'
import * as EditorDelta from './EditorCommandDelta.ts'

export const deleteCharacterLeft = (editor: any) => {
  const newEditor = EditorDeleteHorizontalLeft.editorDeleteHorizontalLeft(editor, EditorDelta.characterLeft)
  return newEditor
}

export const deleteLeft = deleteCharacterLeft
