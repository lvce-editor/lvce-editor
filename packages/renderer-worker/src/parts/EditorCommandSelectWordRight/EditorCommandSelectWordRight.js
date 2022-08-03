import * as EditorSelectHorizontalRight from '../EditorCommandSelectHorizontalRight/EditorCommandSelectHorizontalRight.js'
import * as EditorDelta from '../EditorCommandDelta/EditorCommandDelta.js'

export const editorSelectWordRight = (editor) => {
  return EditorSelectHorizontalRight.editorSelectHorizontalRight(
    editor,
    EditorDelta.wordRight
  )
}
