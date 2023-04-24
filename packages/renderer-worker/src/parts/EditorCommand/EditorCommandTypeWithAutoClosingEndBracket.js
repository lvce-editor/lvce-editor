import * as Editor from '../Editor/Editor.js'
import * as IsAllAutoClosingPairDelete from '../IsAllAutoClosingPairDelete/IsAllAutoClosingPairDelete.js'
import * as EditorType from './EditorCommandType.js'

const overType = (editor) => {
  const { selections } = editor
  const selectionChanges = new Uint32Array([selections[0], selections[1] + 1, selections[2], selections[3] + 1])
  return Editor.scheduleSelections(editor, selectionChanges)
}

export const typeWithAutoClosingEndBracket = (editor, text) => {
  const { autoClosingRanges = [], selections } = editor
  if (IsAllAutoClosingPairDelete.isAllAutoClosingPairDelete(autoClosingRanges, selections)) {
    return overType(editor)
  }
  return EditorType.type(editor, text)
}
