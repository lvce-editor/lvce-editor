import * as EditorSelectHorizontalRight from '../EditorCommandSelectHorizontalRight/EditorCommandSelectHorizontalRight.js'
import * as EditorDelta from '../EditorCommandDelta/EditorCommandDelta.js'

export const editorSelectAllRight = (editor) => {
  return EditorSelectHorizontalRight.editorSelectHorizontalRight(
    editor,
    EditorDelta.lineEnd
  )
}
