import * as EditorSelectHorizontalRight from './EditorCommandSelectHorizontalRight.js'
import * as EditorDelta from './EditorCommandDelta.js'

export const editorSelectWordRight = (editor) => {
  return EditorSelectHorizontalRight.editorSelectHorizontalRight(
    editor,
    EditorDelta.wordRight
  )
}
