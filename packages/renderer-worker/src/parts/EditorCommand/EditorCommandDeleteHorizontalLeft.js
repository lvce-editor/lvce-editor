import * as EditOrigin from '../EditOrigin/EditOrigin.js'
import * as Editor from '../Editor/Editor.js'
import * as EditorSelection from '../EditorSelection/EditorSelection.js'
import * as GetDeleteHorizontalLeftChanges from '../GetDeleteHorizonatlLeftChanges/GetDeleteHorizontalLeftChanges.js'
import * as IsAllAutoClosingPairDelete from '../IsAllAutoClosingPairDelete/IsAllAutoClosingPairDelete.js'
import * as EditorDelta from './EditorCommandDelta.js'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.js'

const deleteLeftWithAutoClose = (editor) => {
  const { selections, lines } = editor
  for (let i = 0; i < selections.length; i += 4) {
    selections[i + 1]++
    selections[i + 3]++
  }
  const changes = GetDeleteHorizontalLeftChanges.getChanges(lines, selections, EditorDelta.twoCharactersLeft)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}

export const editorDeleteHorizontalLeft = (editor, getDelta) => {
  const { autoClosingRanges = [], selections, lines } = editor
  if (IsAllAutoClosingPairDelete.isAllAutoClosingPairDelete(autoClosingRanges, selections)) {
    return deleteLeftWithAutoClose(editor)
  }
  if (EditorSelection.isEverySelectionEmpty(selections)) {
    const changes = GetDeleteHorizontalLeftChanges.getChanges(lines, selections, getDelta)
    return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
  }
  const changes = editorReplaceSelections(editor, [''], EditOrigin.Delete)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
