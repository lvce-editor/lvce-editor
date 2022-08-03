import * as EditorDeleteHorizontalRight from './EditorCommandDeleteHorizontalRight.js'
import * as EditorDelta from './EditorCommandDelta.js'

export const editorDeleteCharacterRight = (editor) => {
  return EditorDeleteHorizontalRight.editorDeleteHorizontalRight(
    editor,
    EditorDelta.characterRight
  )
}
