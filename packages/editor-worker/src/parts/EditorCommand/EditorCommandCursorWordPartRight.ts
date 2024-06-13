import * as EditorCursorHorizontalRight from './EditorCommandCursorHorizontalRight.ts'
import * as EditorDelta from './EditorCommandDelta.ts'

// @ts-ignore
export const cursorWordPartRight = (editor) => {
  return EditorCursorHorizontalRight.editorCursorHorizontalRight(editor, EditorDelta.wordPartRight)
}
