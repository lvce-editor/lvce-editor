import * as EditorDeleteHorizontalLeft from './EditorCommandDeleteHorizontalLeft.js'
import * as EditorDelta from './EditorCommandDelta.js'

export const deleteCharacterLeft = (editor) => {
  return EditorDeleteHorizontalLeft.editorDeleteHorizontalLeft(
    editor,
    EditorDelta.characterLeft
  )
}

export const deleteLeft = deleteCharacterLeft
