import * as EditorSelectHorizontalLeft from './EditorCommandSelectHorizontalLeft.js'
import * as EditorDelta from './EditorCommandDelta.js'

export const editorSelectCharacterLeft = (editor) => {
  return EditorSelectHorizontalLeft.editorSelectHorizontalLeft(
    editor,
    EditorDelta.characterLeft
  )
}
