import * as EditorSelectHorizontalRight from './EditorCommandSelectHorizontalRight.js'
import * as EditorDelta from './EditorCommandDelta.js'

export const selectCharacterRight = (editor) => {
  return EditorSelectHorizontalRight.editorSelectHorizontalRight(
    editor,
    EditorDelta.characterRight
  )
}
