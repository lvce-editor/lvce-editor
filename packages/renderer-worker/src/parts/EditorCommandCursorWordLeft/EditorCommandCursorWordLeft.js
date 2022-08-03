import * as EditorCursorHorizontalLeft from '../EditorCommandCursorHorizontalLeft/EditorCommandCursorHorizontalLeft.js'
import * as EditorDelta from '../EditorCommandDelta/EditorCommandDelta.js'

// TODO put all of these into editor -> also makes extracting editor into standalone npm package easier (no 20+ modules, just single ~10kB bundle)
// also can share code between moveCursorWordRight moveCursoryWordLeft deleteCursorWordLeft

export const editorCursorWordLeft = (editor) => {
  return EditorCursorHorizontalLeft.editorCursorHorizontalLeft(
    editor,
    EditorDelta.wordLeft
  )
}
