import * as EditorSelectHorizontalRight from './EditorCommandSelectHorizontalRight.js'
import * as EditorDelta from './EditorCommandDelta.js'

export const selectWordRight = (editor) => {
  return EditorSelectHorizontalRight.editorSelectHorizontalRight(
    editor,
    EditorDelta.wordRight
  )
}
