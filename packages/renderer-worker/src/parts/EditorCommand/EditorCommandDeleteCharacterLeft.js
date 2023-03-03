import * as EditorDeleteHorizontalLeft from './EditorCommandDeleteHorizontalLeft.js'
import * as EditorDelta from './EditorCommandDelta.js'

export const deleteCharacterLeft = (editor) => {
  const { autoClosingRanges = [], selections } = editor
  if (autoClosingRanges.length > 0) {
    if (
      selections[0] === autoClosingRanges[0] &&
      selections[1] === autoClosingRanges[1] &&
      selections[2] === autoClosingRanges[2] &&
      selections[3] === autoClosingRanges[3]
    ) {
      selections[1]++
      selections[3]++
    }
    return EditorDeleteHorizontalLeft.editorDeleteHorizontalLeft(editor, EditorDelta.twoCharactersLeft)
  }
  return EditorDeleteHorizontalLeft.editorDeleteHorizontalLeft(editor, EditorDelta.characterLeft)
}

export const deleteLeft = deleteCharacterLeft
