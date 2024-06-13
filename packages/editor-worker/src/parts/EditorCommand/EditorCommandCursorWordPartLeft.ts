import * as EditorCursorHorizontalLeft from './EditorCommandCursorHorizontalLeft.ts'
import * as EditorDelta from './EditorCommandDelta.ts'

// @ts-ignore
export const cursorWordPartLeft = (editor) => {
  return EditorCursorHorizontalLeft.editorCursorHorizontalLeft(editor, EditorDelta.wordPartLeft)
}
