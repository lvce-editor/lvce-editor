import * as IsAllAutoClosingPairDelete from '../IsAllAutoClosingPairDelete/IsAllAutoClosingPairDelete.js'
import * as EditorDeleteHorizontalLeft from './EditorCommandDeleteHorizontalLeft.js'
import * as EditorDelta from './EditorCommandDelta.js'

const deleteCharacterLeftWithAutoClose = (editor) => {
  const { selections } = editor
  for (let i = 0; i < selections.length; i += 4) {
    selections[i + 1]++
    selections[i + 3]++
  }
  return EditorDeleteHorizontalLeft.editorDeleteHorizontalLeft(editor, EditorDelta.twoCharactersLeft)
}

export const deleteCharacterLeft = (editor) => {
  const { autoClosingRanges = [], selections } = editor
  if (IsAllAutoClosingPairDelete.isAllAutoClosingPairDelete(autoClosingRanges, selections)) {
    return deleteCharacterLeftWithAutoClose(editor)
  }
  return EditorDeleteHorizontalLeft.editorDeleteHorizontalLeft(editor, EditorDelta.characterLeft)
}

export const deleteLeft = deleteCharacterLeft
