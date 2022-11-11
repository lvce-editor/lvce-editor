import * as EditorSelectHorizontalLeft from './EditorCommandSelectHorizontalLeft.js'
import * as EditorDelta from './EditorCommandDelta.js'

export const selectWordLeft = (editor) => {
  return EditorSelectHorizontalLeft.editorSelectHorizontalLeft(
    editor,
    EditorDelta.wordLeft
  )
}
