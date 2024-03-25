import * as EditorCursorHorizontalLeft from './EditorCommandCursorHorizontalLeft.js'
import * as EditorDelta from './EditorCommandDelta.js'

// TODO put all of these into editor -> also makes extracting editor into standalone npm package easier (no 20+ modules, just single ~10kB bundle)
// also can share code between moveCursorWordRight moveCursoryWordLeft deleteCursorWordLeft

export const cursorWordLeft = (editor) => {
  return EditorCursorHorizontalLeft.editorCursorHorizontalLeft(editor, EditorDelta.wordLeft)
}
