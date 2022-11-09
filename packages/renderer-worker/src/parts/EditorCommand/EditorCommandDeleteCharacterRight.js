import * as EditorDeleteHorizontalRight from './EditorCommandDeleteHorizontalRight.js'
import * as EditorDelta from './EditorCommandDelta.js'

export const deleteCharacterRight = (editor) => {
  return EditorDeleteHorizontalRight.editorDeleteHorizontalRight(
    editor,
    EditorDelta.characterRight
  )
}

export const deleteRight = deleteCharacterRight
