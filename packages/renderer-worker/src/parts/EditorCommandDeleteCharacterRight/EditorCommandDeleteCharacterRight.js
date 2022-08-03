import * as EditorDeleteHorizontalRight from '../EditorCommandDeleteHorizontalRight/EditorCommandDeleteHorizontalRight.js'
import * as EditorDelta from '../EditorCommandDelta/EditorCommandDelta.js'

export const editorDeleteCharacterRight = (editor) => {
  return EditorDeleteHorizontalRight.editorDeleteHorizontalRight(
    editor,
    EditorDelta.characterRight
  )
}
