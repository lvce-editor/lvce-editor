import * as EditorSelectHorizontalRight from './EditorCommandSelectHorizontalRight.js'
import * as EditorDelta from './EditorCommandDelta.js'

export const editorSelectAllRight = (editor) => {
  return EditorSelectHorizontalRight.editorSelectHorizontalRight(
    editor,
    EditorDelta.lineEnd
  )
}
