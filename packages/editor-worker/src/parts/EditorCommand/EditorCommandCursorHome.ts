import * as EditorCursorHorizontalLeft from './EditorCommandCursorHorizontalLeft.ts'
import * as EditorDelta from './EditorCommandDelta.ts'

// @ts-ignore
export const cursorHome = (editor) => {
  return EditorCursorHorizontalLeft.editorCursorHorizontalLeft(editor, EditorDelta.lineCharacterStart)
}
