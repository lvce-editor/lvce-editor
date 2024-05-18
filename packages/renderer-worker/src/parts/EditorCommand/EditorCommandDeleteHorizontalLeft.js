import * as EditOrigin from '../EditOrigin/EditOrigin.js'
import * as Editor from '../Editor/Editor.js'
import * as EditorDeltaId from '../EditorDeltaId/EditorDeltaId.js'
import * as EditorSelection from '../EditorSelection/EditorSelection.js'
import * as GetDeleteHorizontalLeftChanges from '../GetDeleteHorizonatlLeftChanges/GetDeleteHorizontalLeftChanges.js'
import * as GetEditorDeltaFunction from '../GetEditorDeltaFunction/GetEditorDeltaFunction.js'
import * as IsAllAutoClosingPairDelete from '../IsAllAutoClosingPairDelete/IsAllAutoClosingPairDelete.js'
import { editorReplaceSelections } from './EditorCommandReplaceSelection.js'

const deleteLeftWithAutoClose = (editor) => {
  const { selections, lines } = editor
  for (let i = 0; i < selections.length; i += 4) {
    selections[i + 1]++
    selections[i + 3]++
  }
  const changes = GetDeleteHorizontalLeftChanges.getChanges(
    lines,
    selections,
    GetEditorDeltaFunction.getEditorDeltaFunction(EditorDeltaId.TwoCharactersLeft),
  )
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}

export const editorDeleteHorizontalLeft = (editor, deltaId) => {
  const { autoClosingRanges = [], selections, lines } = editor
  const fn = GetEditorDeltaFunction.getEditorDeltaFunction(deltaId)
  if (IsAllAutoClosingPairDelete.isAllAutoClosingPairDelete(autoClosingRanges, selections)) {
    return deleteLeftWithAutoClose(editor)
  }
  if (EditorSelection.isEverySelectionEmpty(selections)) {
    const changes = GetDeleteHorizontalLeftChanges.getChanges(lines, selections, fn)
    return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
  }
  const changes = editorReplaceSelections(editor, [''], EditOrigin.Delete)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
