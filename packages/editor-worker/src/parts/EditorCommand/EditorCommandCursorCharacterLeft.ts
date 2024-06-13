import * as EditorCursorHorizontalLeft from './EditorCommandCursorHorizontalLeft.ts'
import * as EditorDelta from './EditorCommandDelta.ts'

// @ts-ignore
export const cursorCharacterLeft = (editor) => {
  return EditorCursorHorizontalLeft.editorCursorHorizontalLeft(editor, EditorDelta.characterLeft)
}

export const cursorLeft = cursorCharacterLeft
