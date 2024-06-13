import * as EditorCursorHorizontalLeft from './EditorCommandCursorHorizontalLeft.ts'
import * as EditorDelta from './EditorCommandDelta.ts'

export const cursorHome = (editor) => {
  return EditorCursorHorizontalLeft.editorCursorHorizontalLeft(editor, EditorDelta.lineCharacterStart)
}
