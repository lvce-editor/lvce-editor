import * as EditorSelectHorizontalLeft from '../EditorCommandSelectHorizontalLeft/EditorCommandSelectHorizontalLeft.js'
import * as EditorDelta from '../EditorCommandDelta/EditorCommandDelta.js'

export const editorSelectCharacterLeft = (editor) => {
  return EditorSelectHorizontalLeft.editorSelectHorizontalLeft(
    editor,
    EditorDelta.characterLeft
  )
}
