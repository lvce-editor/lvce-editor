import * as EditorSelectHorizontalLeft from '../EditorCommandSelectHorizontalLeft/EditorCommandSelectHorizontalLeft.js'
import * as EditorDelta from '../EditorCommandDelta/EditorCommandDelta.js'

export const editorSelectWordLeft = (editor) => {
  return EditorSelectHorizontalLeft.editorSelectHorizontalLeft(
    editor,
    EditorDelta.wordLeft
  )
}
