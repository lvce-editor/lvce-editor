import * as EditorDeleteHorizontalLeft from './EditorCommandDeleteHorizontalLeft.ts'
import * as EditorDelta from './EditorCommandDelta.ts'

// @ts-ignore
export const deleteCharacterLeft = (editor) => {
  const newEditor = EditorDeleteHorizontalLeft.editorDeleteHorizontalLeft(editor, EditorDelta.characterLeft)
  return {
    newState: newEditor,
    commands: [],
  }
}

export const deleteLeft = deleteCharacterLeft
