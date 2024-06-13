// @ts-ignore
import * as Editor from '../Editor/Editor.ts'
// @ts-ignore
import * as IsAllAutoClosingPairDelete from '../IsAllAutoClosingPairDelete/IsAllAutoClosingPairDelete.ts'
import * as EditorType from './EditorCommandType.ts'

// @ts-ignore
const overType = (editor) => {
  const { selections } = editor
  const selectionChanges = new Uint32Array([selections[0], selections[1] + 1, selections[2], selections[3] + 1])
  return Editor.scheduleSelections(editor, selectionChanges)
}

// @ts-ignore
export const typeWithAutoClosingEndBracket = (editor, text) => {
  const { autoClosingRanges = [], selections } = editor
  if (IsAllAutoClosingPairDelete.isAllAutoClosingPairDelete(autoClosingRanges, selections)) {
    return overType(editor)
  }
  return EditorType.type(editor, text)
}
