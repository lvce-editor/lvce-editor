import * as EditorSelectHorizontalLeft from './EditorCommandSelectHorizontalLeft.js'
import * as EditorDelta from './EditorCommandDelta.js'

export const editorSelectAllLeft = (editor) => {
  EditorSelectHorizontalLeft.editorSelectHorizontalLeft(
    editor,
    EditorDelta.lineCharacterStart
  )
}
