import * as EditorCursorHorizontalLeft from './EditorCommandCursorHorizontalLeft.ts'
import * as EditorDelta from './EditorCommandDelta.ts'

// TODO put all of these into editor -> also makes extracting editor into standalone npm package easier (no 20+ modules, just single ~10kB bundle)
// also can share code between moveCursorWordRight moveCursoryWordLeft deleteCursorWordLeft

// @ts-ignore
export const cursorWordLeft = (editor) => {
  return EditorCursorHorizontalLeft.editorCursorHorizontalLeft(editor, EditorDelta.wordLeft)
}
