import * as EditorDeleteHorizontalLeft from './EditorCommandDeleteHorizontalLeft.js'
import * as EditorDelta from './EditorCommandDelta.js'

export const deleteAllLeft = (editor) => {
  return EditorDeleteHorizontalLeft.editorDeleteHorizontalLeft(
    editor,
    EditorDelta.lineCharacterStart
  )
}
