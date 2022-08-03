import * as EditorSelectHorizontalLeft from '../EditorCommandSelectHorizontalLeft/EditorCommandSelectHorizontalLeft.js'
import * as EditorDelta from '../EditorCommandDelta/EditorCommandDelta.js'

export const editorSelectAllLeft = (editor) => {
  EditorSelectHorizontalLeft.editorSelectHorizontalLeft(
    editor,
    EditorDelta.lineCharacterStart
  )
}
